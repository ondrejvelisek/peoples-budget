import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { type SimpleQueryResult } from "@/lib/utils";
import expenses2025Csv from "./expenses_2025.csv?raw";
import { createServerFn } from "@tanstack/react-start";
import {
  useChildrenExpenseDimension,
  useUrlExpenseSplat,
  type ExpenseDimension,
  type ExpenseKey,
} from "./expenseDimensions";
import { getItem, type Item } from "../items";

export type ExpenseItem = Item<ExpenseDimension>;

export const getExpense = createServerFn()
  .validator(
    (data: { expenseKey: ExpenseKey; childrenDimension?: ExpenseDimension }) =>
      data
  )
  .handler(async ({ data }): Promise<ExpenseItem> => {
    return await getItem(
      "expense",
      expenses2025Csv,
      "Všechny výdaje",
      data.expenseKey,
      data.childrenDimension
    );
  });

export const expenseQueryOptions = (
  expenseKey: ExpenseKey,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: ["expense", expenseKey, childrenDimension],
    queryFn: async () =>
      getExpense({ data: { expenseKey, childrenDimension } }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useExpense = (
  expenseKey: ExpenseKey = []
): SimpleQueryResult<ExpenseItem> => {
  const splat = useUrlExpenseSplat();
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useQuery(
    expenseQueryOptions(expenseKey, childrenDimension)
  );
  return { data, isPending, isFetching, error };
};
