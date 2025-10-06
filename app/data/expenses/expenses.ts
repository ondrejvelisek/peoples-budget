import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { type SimpleQueryResult } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import {
  useChildrenExpenseDimension,
  useUrlExpenseSplat,
  type ExpenseDimension,
  type ExpenseKey,
} from "./expenseDimensions";
import { getItem, type Item } from "../items";
import { useBudgetName } from "@/lib/budget";

export type ExpenseItem = Item<ExpenseDimension>;

export const getExpense = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      expenseKey: ExpenseKey;
      childrenDimension?: ExpenseDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<ExpenseItem> => {
    const item = await getItem(
      data.budgetName,
      "expenses",
      "Všechny výdaje",
      data.expenseKey,
      data.childrenDimension
    );
    if (!item) {
      throw new Error("Expense item not found by key");
    }
    return item;
  });

export const expenseQueryOptions = (
  budgetName: string,
  expenseKey: ExpenseKey,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: ["expense", budgetName, expenseKey, childrenDimension],
    queryFn: async () =>
      getExpense({
        data: { budgetName, expenseKey, childrenDimension },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useExpense = (
  expenseKey: ExpenseKey = []
): SimpleQueryResult<ExpenseItem> => {
  const budgetName = useBudgetName();
  const splat = useUrlExpenseSplat();
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useQuery(
    expenseQueryOptions(budgetName, expenseKey, childrenDimension)
  );
  return { data, isPending, isFetching, error };
};
