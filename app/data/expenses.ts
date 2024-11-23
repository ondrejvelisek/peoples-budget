import lodash from "lodash";
const { isEqual } = lodash;
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { parseCsv, type SimpleQueryResult } from "@/lib/utils";
import expenses2025Csv from "./expenses_2025.csv?raw";
import { createServerFn } from "@tanstack/start";
import { getExpensesTables, type ExpensesTables } from "./tables";
import {
  useChildrenExpenseDimension,
  type ExpenseDimension,
} from "./expenseDimensions";
import { useParams } from "@tanstack/react-router";
import { kvStorage } from "./kvStorage";
import { createStorage, prefixStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";

const expensesStorage = prefixStorage<ExpenseItem>(kvStorage, "expenses:");
const expensesMemoryStorage = createStorage<ExpenseItem>({
  driver: memoryDriver(),
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

function reduceAmount(record: ExpensesDataRecord, acc?: ExpenseItem) {
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

function reduceParent(expenseKey: ExpenseKey, acc?: ExpenseItem) {
  return expenseKey.length
    ? acc?.parent
      ? acc.parent
      : expenseKey.slice(0, -1)
    : undefined;
}

type ExpenseKeyWithAmount = ExpenseKey & {
  amount: number;
};

type ExpenseItemWithChildrenAmount = Omit<ExpenseItem, "children"> & {
  children: Array<ExpenseKeyWithAmount>;
};

function reduceChildren(
  expenseKey: ExpenseKey,
  dimension: ExpenseDimension | undefined,
  record: ExpensesDataRecord,
  acc?: ExpenseItemWithChildrenAmount
): Array<ExpenseKeyWithAmount> {
  let id: undefined | string;
  if (dimension === "odvetvi") {
    const numOfSectorDimensions =
      expenseKey.filter(({ dimension }) => dimension === "odvetvi").length + 1;
    if (numOfSectorDimensions <= 4) {
      const numOfSectorChars = numOfSectorDimensions;
      id = String(record.sector_id).slice(0, numOfSectorChars);
    }
  }
  if (dimension === "druh") {
    const numOfTypeDimensions =
      expenseKey.filter(({ dimension }) => dimension === "druh").length + 1;
    if (numOfTypeDimensions <= 3) {
      const numOfTypeChars =
        numOfTypeDimensions === 0 ? 0 : numOfTypeDimensions + 1;
      id = String(record.type_id).slice(0, numOfTypeChars);
    }
  }
  if (dimension === "urad") {
    const numOfOfficeDimensions =
      expenseKey.filter(({ dimension }) => dimension === "urad").length + 1;
    if (numOfOfficeDimensions <= 2) {
      const numOfOfficeChars =
        numOfOfficeDimensions === 0 ? 0 : numOfOfficeDimensions === 1 ? 3 : 7;
      id = String(record.office_id).slice(0, numOfOfficeChars);
    }
  }
  if (!dimension || !id) {
    return acc?.children ?? [];
  }

  const child: ExpenseKeyWithAmount = Object.assign(
    [...expenseKey, { dimension, id }],
    { amount: record.amount }
  );

  const existingChild =
    acc &&
    acc.children.find((ch) =>
      ch.every((item, idx) => isEqual(item, child[idx]))
    );
  if (existingChild) {
    existingChild.amount += record.amount;
    return acc.children;
  }

  const children = acc?.children ?? [];

  children.push(child);

  return children;
}

export const getExpense = createServerFn(
  "GET",
  async (params: {
    expenseKey: ExpenseKey;
    childrenDimension?: ExpenseDimension;
  }): Promise<ExpenseItem> => {
    const expenseKey = params.expenseKey;
    const childrenDimension = params.childrenDimension;
    const cacheKeyStr = JSON.stringify(params);

    const memoryCached = await expensesMemoryStorage.getItem(cacheKeyStr);
    if (memoryCached) {
      console.log("CACHE(getExpense): memory HIT", cacheKeyStr);
      return memoryCached;
    }
    const cached = await expensesStorage.getItem(cacheKeyStr);
    if (cached) {
      console.log("CACHE(getExpense): HIT", cacheKeyStr);
      return cached;
    }
    console.log("CACHE(getExpense): MISS", cacheKeyStr);

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
      acc: ExpenseItemWithChildrenAmount | undefined
    ): ExpenseItemWithChildrenAmount {
      if (!acc) {
        return {
          key: expenseKey,
          title: reduceTitle(expenseKey, tables),
          amount: reduceAmount(record),
          children: reduceChildren(expenseKey, childrenDimension, record),
          parent: reduceParent(expenseKey),
          childrenDimension,
        };
      }
      // more performant than creating new object
      acc.amount = reduceAmount(record, acc);
      acc.children = reduceChildren(expenseKey, childrenDimension, record, acc);
      return acc;
    }

    const expense = await parseCsv<
      ExpensesDataRecord,
      ExpenseItemWithChildrenAmount
    >(expenses2025Csv, filter, reduce);

    expense.children.sort((a, b) => b.amount - a.amount);

    await expensesMemoryStorage.setItem(cacheKeyStr, expense);
    await expensesStorage.setItem(cacheKeyStr, expense);
    return expense;
  }
);

export const expenseQueryOptions = (
  expenseKey: ExpenseKey,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: ["expense", expenseKey, childrenDimension],
    queryFn: async () => getExpense({ expenseKey, childrenDimension }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useExpense = (
  expenseKey: ExpenseKey = []
): SimpleQueryResult<ExpenseItem> => {
  const splat = useParams({ strict: false })._splat;
  if (!splat) {
    throw new Error("useExpense: Missing splat in url");
  }
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useQuery(
    expenseQueryOptions(expenseKey, childrenDimension)
  );
  return { data, isPending, isFetching, error };
};
