import { queryOptions, useQuery } from "@tanstack/react-query";
import { parseCsv, type SimpleQueryResult } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { getBudgetFile } from "../files/files";
import type { DataRecord } from "../items";
import FlatQueue from "flatqueue";
import { getRecordTables } from "../dimensions/recordTables";

type Key = `${number | ""}|${number | ""}|${number | ""}`;

const stringifyKey = (
  sectorId: string | number | null,
  typeId: string | number | null,
  officeId: string | number | null
): Key => {
  const sectorIdNumber = sectorId ? Number(sectorId) : "";
  const typeIdNumber = typeId ? Number(typeId) : "";
  const officeIdNumber = officeId ? Number(officeId) : "";
  return `${sectorIdNumber}|${typeIdNumber}|${officeIdNumber}`;
};

const parseKey = (key: Key): [string | null, string | null, string | null] => {
  const [sectorId, typeId, officeId] = key.split("|");
  return [sectorId ?? null, typeId ?? null, officeId ?? null];
};

export type CompareItem = {
  sectorId: string | null; // income items does not have sector_id, but lazy to make it conditioanlly generic
  typeId: string | null;
  officeId: string | null;
  sectorTitle?: string;
  typeTitle?: string;
  officeTitle?: string;
  firstAmount: number;
  secondAmount: number;
  compareScore: number;
};

const calculateBudgetMap = async (
  budgetName: string
): Promise<Map<Key, number>> => {
  const budgetCsv = await getBudgetFile(budgetName, "expenses");
  return parseCsv<DataRecord, Map<Key, number>>(
    budgetCsv,
    undefined,
    (record, acc) => {
      const keys: Array<[number | null, number | null, number | null]> = [
        [null, null, null],
      ];

      const sectorId = String(record.sector_id);
      keys.forEach(([, typeId, officeId]) => {
        keys.push([Number(sectorId.substring(0, 1)), typeId, officeId]);
        keys.push([Number(sectorId.substring(0, 2)), typeId, officeId]);
        keys.push([Number(sectorId.substring(0, 3)), typeId, officeId]);
        //keys.push([Number(sectorId.substring(0, 4)), typeId, officeId]);
      });

      const typeId = String(record.type_id);
      keys.forEach(([sectorId, , officeId]) => {
        keys.push([sectorId, Number(typeId.substring(0, 2)), officeId]);
        keys.push([sectorId, Number(typeId.substring(0, 3)), officeId]);
        //keys.push([sectorId, Number(typeId.substring(0, 4)), officeId]);
      });

      const officeId = String(record.office_id);
      keys.forEach(([sectorId, typeId]) => {
        keys.push([sectorId, typeId, Number(officeId.substring(0, 3))]);
        //keys.push([sectorId, typeId, Number(officeId.substring(0, 7))]);
      });

      const amount = record.amount;

      if (!acc) {
        acc = new Map();
      }
      keys.forEach((key) => {
        const keyString = stringifyKey(...key);
        const existingAmount = acc.get(keyString);
        acc.set(keyString, (existingAmount ?? 0) + amount);
      });

      return acc;
    },
    new Map<Key, number>()
  );
};

export function calculateRelativeChange(
  firstAmount: number,
  secondAmount: number
): number {
  if (secondAmount === 0) {
    return firstAmount === 0 ? 0 : Infinity;
  }
  return (firstAmount - secondAmount) / secondAmount;
}

const calculateCompareScore = (
  firstAmount: number,
  secondAmount: number
): number => {
  const absoluteChange = firstAmount - secondAmount;
  const relativeChange =
    firstAmount < secondAmount
      ? calculateRelativeChange(firstAmount, secondAmount)
      : calculateRelativeChange(secondAmount, firstAmount);

  const relativeToAbsoluteConversion = 20_000_000;
  const relativeChangeNormalized =
    relativeChange * relativeToAbsoluteConversion;

  const relativeWeight = 0.5; // number from 0 to 1. 0 means to ignore relative difference, 1 means to ignore absolute difference

  const score =
    relativeWeight * relativeChangeNormalized +
    (1 - relativeWeight) * absoluteChange;

  return score;
};

const calculateCompare = async (
  firstBudgetName: string,
  secondBudgetName: string
): Promise<Array<CompareItem>> => {
  const firstBudgetMap: Map<Key, number> =
    await calculateBudgetMap(firstBudgetName);
  const secondBudgetMap: Map<Key, number> =
    await calculateBudgetMap(secondBudgetName);
  const { sectors, types, offices } = await getRecordTables();

  const allKeys = Array.from(
    new Set<Key>([...firstBudgetMap.keys(), ...secondBudgetMap.keys()])
  ).sort((a, b) => a.length - b.length);

  const dedupMap = new Map<Key, CompareItem>();
  allKeys.forEach((key: Key) => {
    const [sectorId, typeId, officeId] = parseKey(key);

    const firstAmount = firstBudgetMap.get(key) ?? 0;
    const secondAmount = secondBudgetMap.get(key) ?? 0;
    const compareScore = calculateCompareScore(firstAmount, secondAmount);

    const compareItem: CompareItem = {
      sectorId,
      typeId,
      officeId,
      sectorTitle: sectorId ? sectors[sectorId]?.name : undefined,
      typeTitle: typeId ? types[typeId]?.name : undefined,
      officeTitle: officeId ? offices[officeId]?.name : undefined,
      firstAmount,
      secondAmount,
      compareScore,
    };

    const sectorParentKey = stringifyKey(
      sectorId?.slice(0, -1) ?? null,
      typeId,
      officeId
    );
    const sectorParent = dedupMap.get(sectorParentKey);
    if (sectorParent) {
      const absoluteChange = firstAmount - secondAmount;
      const parentAbsoluteChange =
        sectorParent.firstAmount - sectorParent.secondAmount;
      const relativeChangeOfChange =
        (absoluteChange - parentAbsoluteChange) / absoluteChange;
      if (relativeChangeOfChange < 0.03) {
        dedupMap.delete(sectorParentKey);
      }
    }

    const typeParentKey = stringifyKey(
      sectorId,
      typeId && typeId.length > 2 ? (typeId?.slice(0, -1) ?? null) : null,
      officeId
    );
    const typeParent = dedupMap.get(typeParentKey);
    if (typeParent) {
      const absoluteChange = firstAmount - secondAmount;
      const parentAbsoluteChange =
        typeParent.firstAmount - typeParent.secondAmount;
      const relativeChangeOfChange =
        (absoluteChange - parentAbsoluteChange) / absoluteChange;
      if (relativeChangeOfChange < 0.03) {
        dedupMap.delete(typeParentKey);
      }
    }

    const officeParentKey = stringifyKey(
      sectorId,
      typeId,
      officeId && officeId.length > 4 ? (officeId?.slice(0, -4) ?? null) : null
    );
    const officeParent = dedupMap.get(officeParentKey);
    if (officeParent) {
      const absoluteChange = firstAmount - secondAmount;
      const parentAbsoluteChange =
        officeParent.firstAmount - officeParent.secondAmount;
      const relativeChangeOfChange =
        (absoluteChange - parentAbsoluteChange) / absoluteChange;
      if (relativeChangeOfChange < 0.03) {
        dedupMap.delete(officeParentKey);
      }
    }

    dedupMap.set(key, compareItem);
  });

  const orderedCompareItems = new FlatQueue<CompareItem>();
  dedupMap.forEach((item) => {
    orderedCompareItems.push(item, -Math.abs(item.compareScore));
  });

  const topOrderedCompareItems = Array.from({ length: 100 }, () => {
    const item = orderedCompareItems.pop();
    if (!item) {
      return null;
    }
    return item;
  }).filter((item) => !!item);

  return topOrderedCompareItems;
};

export const compareBudgets = createServerFn()
  .validator(
    (data: { firstBudgetName: string; secondBudgetName: string }) => data
  )
  .handler(async ({ data }): Promise<Array<CompareItem>> => {
    return await calculateCompare(data.firstBudgetName, data.secondBudgetName);
  });

export const compareQueryOptions = (
  firstBudgetName: string,
  secondBudgetName: string
) =>
  queryOptions({
    queryKey: ["comapre", firstBudgetName, secondBudgetName],
    queryFn: async () =>
      compareBudgets({
        data: { firstBudgetName, secondBudgetName },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

export const useCompare = (): SimpleQueryResult<Array<CompareItem>> => {
  const firstBudgetName = "2025";
  const secondBudgetName = "2024";
  const { data, isPending, isFetching, error } = useQuery(
    compareQueryOptions(firstBudgetName, secondBudgetName)
  );
  return { data, isPending, isFetching, error };
};
