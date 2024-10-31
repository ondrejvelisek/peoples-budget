import lodash from "lodash";
const { isEqual, uniqWith } = lodash;
import { queryOptions, useQuery } from "@tanstack/react-query";
import { parseCsv, type SimpleQueryResult } from "@/lib/utils";
import expenses2025Csv from "./expenses_2025.csv?raw";
import { createServerFn } from "@tanstack/start";
import { getExpensesTables, type ExpensesTables } from "./tables";
import { FlatCache } from "flat-cache";
import {
  accessChildrenExpenseDimension,
  type ExpenseDimension,
} from "./expenseDimensions";

const cache = new FlatCache({
  ttl: 30 * 24 * 60 * 60 * 1000, // 1 month
  lruSize: 1000,
  expirationInterval: 24 * 60 * 1000 * 60, // 1 day
});

export type ExpenseKey = Array<{
  dimension: ExpenseDimension;
  id: string;
}>;

export type ExpenseItem = {
  key: ExpenseKey;
  title: string;
  amount: number;
  children: Array<ExpenseKey>;
  childrenDimension?: ExpenseDimension;
  parent?: ExpenseKey;
};

type ExpensesDataRecord = {
  sector_id: number;
  type_id: number;
  office_id: number;
  amount: number;
};

function reduceAmount(
  record: ExpensesDataRecord,
  acc: ExpenseItem | undefined
) {
  return acc ? acc.amount + record.amount : record.amount;
}

function reduceTitle(
  expenseKey: ExpenseKey,
  { sectors, types, offices }: ExpensesTables
): string {
  const lastKey = expenseKey.at(-1);
  if (!lastKey) {
    return "Všechny výdaje";
  }
  if (lastKey.dimension === "odvetvi") {
    const sector = sectors[lastKey.id];
    return sector?.name ?? "Neznámé odvětví";
  }
  if (lastKey.dimension === "druh") {
    const type = types[lastKey.id];
    return type?.name ?? "Neznámý druh";
  }
  if (lastKey.dimension === "urad") {
    const office = offices[lastKey.id];
    return office?.name ?? "Neznámý úřad";
  }
  throw new Error(`Invalid dimension: ${lastKey.dimension}`);
}

function reduceParent(expenseKey: ExpenseKey, acc: ExpenseItem | undefined) {
  return expenseKey.length
    ? acc?.parent
      ? acc.parent
      : expenseKey.slice(0, -1)
    : undefined;
}

function reduceChildren(
  expenseKey: ExpenseKey,
  dimension: ExpenseDimension | undefined,
  record: ExpensesDataRecord,
  acc: ExpenseItem | undefined
): Array<ExpenseKey> {
  let id = "";
  if (dimension === "odvetvi") {
    const numOfSectorDimensions =
      expenseKey.filter(({ dimension }) => dimension === "odvetvi").length +
      (dimension === "odvetvi" ? 1 : 0);
    const numOfSectorChars = numOfSectorDimensions;
    id = String(record.sector_id).slice(0, numOfSectorChars);
  }
  if (dimension === "druh") {
    const numOfTypeDimensions =
      expenseKey.filter(({ dimension }) => dimension === "druh").length +
      (dimension === "druh" ? 1 : 0);
    const numOfTypeChars =
      numOfTypeDimensions === 0 ? 0 : numOfTypeDimensions + 1;
    id = String(record.type_id).slice(0, numOfTypeChars);
  }
  if (dimension === "urad") {
    const numOfOfficeDimensions =
      expenseKey.filter(({ dimension }) => dimension === "urad").length +
      (dimension === "urad" ? 1 : 0);
    const numOfOfficeChars =
      numOfOfficeDimensions === 0 ? 0 : numOfOfficeDimensions === 1 ? 3 : 7;
    id = String(record.office_id).slice(0, numOfOfficeChars);
  }
  if (!dimension) {
    return acc?.children ?? [];
  }

  const child: ExpenseKey = [...expenseKey, { dimension, id }];

  const children = uniqWith([...(acc?.children ?? []), child], isEqual);

  return children;
}

export const getExpense = createServerFn(
  "GET",
  async (params: {
    expenseKey: ExpenseKey;
    expenseDimension?: ExpenseDimension;
  }): Promise<ExpenseItem> => {
    const expenseKey = params.expenseKey;
    const childrenDimension =
      params.expenseDimension ?? accessChildrenExpenseDimension(expenseKey);
    const cacheKeyStr = JSON.stringify(params);
    const cached = cache.get<ExpenseItem | undefined>(cacheKeyStr);
    if (cached) {
      return cached;
    }

    const tables = await getExpensesTables();

    function filter(record: ExpensesDataRecord) {
      return expenseKey.every(({ dimension, id }) => {
        if (dimension === "odvetvi") {
          return String(record.sector_id).startsWith(id);
        }
        if (dimension === "druh") {
          return String(record.type_id).startsWith(id);
        }
        if (dimension === "urad") {
          return String(record.office_id).startsWith(id);
        }
        throw new Error(`Invalid dimension: ${dimension}`);
      });
    }

    function reduce(
      record: ExpensesDataRecord,
      acc: ExpenseItem | undefined
    ): ExpenseItem {
      if (acc) {
        // more performant than creating new object
        acc.key = expenseKey;
        acc.title = reduceTitle(expenseKey, tables);
        acc.amount = reduceAmount(record, acc);
        acc.children = reduceChildren(
          expenseKey,
          childrenDimension,
          record,
          acc
        );
        acc.parent = reduceParent(expenseKey, acc);
        return acc;
      }
      return {
        key: expenseKey,
        title: reduceTitle(expenseKey, tables),
        amount: reduceAmount(record, acc),
        children: reduceChildren(expenseKey, childrenDimension, record, acc),
        parent: reduceParent(expenseKey, acc),
        childrenDimension,
      };
    }

    const expense = await parseCsv<ExpensesDataRecord, ExpenseItem>(
      expenses2025Csv,
      filter,
      reduce
    );

    cache.set(cacheKeyStr, expense);
    return expense;
  }
);

export const expenseQueryOptions = (
  expenseKey: ExpenseKey,
  expenseDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: ["expense", expenseKey],
    queryFn: async () => getExpense({ expenseKey, expenseDimension }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

export const useExpense = (
  expenseKey: ExpenseKey = []
): SimpleQueryResult<ExpenseItem> => {
  const { data, isPending, isFetching, error } = useQuery(
    expenseQueryOptions(expenseKey)
  );
  return { data, isPending, isFetching, error };
};
