import { type SimpleQueryResult } from "@/lib/utils";
import {
  useChildrenExpenseDimension,
  useUrlExpenseSplat,
  type ExpenseDimension,
  type ExpenseKey,
} from "../expenses/expenseDimensions";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { getCompareItem, type CompareItem } from "../items";
import { createServerFn } from "@tanstack/react-start";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

export type CompareExpenseItem = CompareItem<ExpenseDimension>;

export const getCompareExpense = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      secondBudgetName: string;
      expenseKey: ExpenseKey;
      childrenDimension?: ExpenseDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<CompareExpenseItem> => {
    return await getCompareItem(
      data.budgetName,
      data.secondBudgetName,
      "expenses",
      "Všechny výdaje",
      data.expenseKey,
      data.childrenDimension
    );
  });

export const compareExpenseQueryOptions = (
  budgetName: string,
  secondBudgetName: string,
  expenseKey: ExpenseKey,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: [
      "compareExpense",
      budgetName,
      secondBudgetName,
      expenseKey,
      childrenDimension,
    ],
    queryFn: async () =>
      getCompareExpense({
        data: { budgetName, secondBudgetName, expenseKey, childrenDimension },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useCompareExpense = (
  expenseKey: ExpenseKey = []
): SimpleQueryResult<CompareExpenseItem> => {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const splat = useUrlExpenseSplat();
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useQuery(
    compareExpenseQueryOptions(
      budgetName,
      secondBudgetName,
      expenseKey,
      childrenDimension
    )
  );
  return { data, isPending, isFetching, error };
};
