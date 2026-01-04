import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import {
  useChildrenExpenseDimension,
  useUrlExpenseSplat,
  type ExpenseDimension,
  type ExpenseKey,
} from "./expenseDimensions";
import { getItem, type Item } from "../items";
import { useBudgetName } from "@/lib/budget";
import { useMyQuery } from "@/lib/utils";
import { useHealthInsurance } from "@/components/Explorer/HealthInsuranceSwitcher";

export type ExpenseItem = Item<ExpenseDimension>;

export const getExpense = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      expenseKey: ExpenseKey;
      healthInsurance: boolean;
      childrenDimension?: ExpenseDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<ExpenseItem> => {
    const item = await getItem(
      data.budgetName,
      "expenses",
      "Všechny výdaje",
      data.expenseKey,
      data.healthInsurance,
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
  healthInsurance: boolean,
  childrenDimension?: ExpenseDimension
) =>
  queryOptions({
    queryKey: [
      "expense",
      budgetName,
      expenseKey,
      healthInsurance,
      childrenDimension,
    ],
    queryFn: async () =>
      getExpense({
        data: { budgetName, expenseKey, healthInsurance, childrenDimension },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useExpense = (expenseKey: ExpenseKey = []) => {
  const budgetName = useBudgetName();
  const splat = useUrlExpenseSplat();
  const [healthInsurance] = useHealthInsurance();
  const childrenDimension = useChildrenExpenseDimension(splat, expenseKey);
  const { data, isPending, isFetching, error } = useMyQuery(
    expenseQueryOptions(
      budgetName,
      expenseKey,
      healthInsurance,
      childrenDimension
    )
  );
  return { data, isPending, isFetching, error };
};
