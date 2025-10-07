import { useMyQuery, type SimpleQueryResult } from "@/lib/utils";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { getCompareItem, type CompareItem } from "../items";
import { createServerFn } from "@tanstack/react-start";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  useChildrenIncomeDimension,
  useUrlIncomeSplat,
  type IncomeDimension,
  type IncomeKey,
} from "../incomes/incomeDimensions";

export type CompareIncomeItem = CompareItem<IncomeDimension>;

export const getCompareIncome = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      secondBudgetName: string;
      incomeKey: IncomeKey;
      childrenDimension?: IncomeDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<CompareIncomeItem> => {
    return await getCompareItem(
      data.budgetName,
      data.secondBudgetName,
      "incomes",
      "Všechny příjmy",
      data.incomeKey,
      data.childrenDimension
    );
  });

export const compareIncomeQueryOptions = (
  budgetName: string,
  secondBudgetName: string,
  incomeKey: IncomeKey,
  childrenDimension?: IncomeDimension
) =>
  queryOptions({
    queryKey: [
      "compareIncome",
      budgetName,
      secondBudgetName,
      incomeKey,
      childrenDimension,
    ],
    queryFn: async () =>
      getCompareIncome({
        data: { budgetName, secondBudgetName, incomeKey, childrenDimension },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useCompareIncome = (
  incomeKey: IncomeKey = []
): SimpleQueryResult<CompareIncomeItem> => {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const splat = useUrlIncomeSplat();
  const childrenDimension = useChildrenIncomeDimension(splat, incomeKey);
  const { data, isPending, isFetching, error } = useMyQuery(
    compareIncomeQueryOptions(
      budgetName,
      secondBudgetName,
      incomeKey,
      childrenDimension
    )
  );
  return { data, isPending, isFetching, error };
};
