import { useMyQuery, type SimpleQueryResult } from "@/lib/utils";
import {
  useChildrenExpenseDimension,
  useUrlExpenseSplat,
  type ExpenseDimension,
  type ExpenseKey,
} from "../expenses/expenseDimensions";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { getCompareItem, type CompareItem } from "../items";
import { createServerFn } from "@tanstack/react-start";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { useHealthInsurance } from "@/components/Explorer/HealthInsuranceSwitcher";

export type CompareExpenseItem = CompareItem<ExpenseDimension>;

export const getCompareExpense = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      secondBudgetName: string;
      expenseKey: ExpenseKey;
      healthInsurance: boolean;
      childrenDimension?: ExpenseDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<CompareExpenseItem> => {
    return await getCompareItem(
      data.budgetName,
      data.secondBudgetName,
      "expenses",
      "Výdaje rozpočtu",
      data.expenseKey,
      data.healthInsurance,
      data.childrenDimension
    );
  });

export const compareExpenseQueryOptions = (
  budgetName: string,
  secondBudgetName: string,
  expenseKey: ExpenseKey,
  healthInsurance: boolean,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: [
      "compareExpense",
      budgetName,
      secondBudgetName,
      expenseKey,
      healthInsurance,
      childrenDimension,
    ],
    queryFn: async () =>
      getCompareExpense({
        data: {
          budgetName,
          secondBudgetName,
          expenseKey,
          healthInsurance,
          childrenDimension,
        },
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
  const [healthInsurance] = useHealthInsurance();
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useMyQuery(
    compareExpenseQueryOptions(
      budgetName,
      secondBudgetName,
      expenseKey,
      healthInsurance,
      childrenDimension
    )
  );
  return { data, isPending, isFetching, error };
};
