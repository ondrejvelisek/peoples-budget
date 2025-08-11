import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { type SimpleQueryResult } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { getItem, type Item } from "../items";
import {
  useChildrenIncomeDimension,
  useUrlIncomeSplat,
  type IncomeDimension,
  type IncomeKey,
} from "./incomeDimensions";
import { useBudgetName } from "@/lib/budget";

export type IncomeItem = Item<IncomeDimension>;

export const getIncome = createServerFn()
  .validator(
    (data: {
      budgetName: string;
      incomeKey: IncomeKey;
      childrenDimension?: IncomeDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<IncomeItem> => {
    return await getItem(
      data.budgetName,
      "incomes",
      "Všechny příjmy",
      data.incomeKey,
      data.childrenDimension
    );
  });

export const incomeQueryOptions = (
  budgetName: string,
  incomeKey: IncomeKey,
  childrenDimension?: IncomeDimension
) =>
  queryOptions({
    queryKey: ["income", incomeKey, childrenDimension],
    queryFn: async () =>
      getIncome({ data: { budgetName, incomeKey, childrenDimension } }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useIncome = (
  incomeKey: IncomeKey = []
): SimpleQueryResult<IncomeItem> => {
  const budgetName = useBudgetName();
  const splat = useUrlIncomeSplat();
  const childrenDimension = useChildrenIncomeDimension(splat, incomeKey);
  const { data, isPending, isFetching, error } = useQuery(
    incomeQueryOptions(budgetName, incomeKey, childrenDimension)
  );
  return { data, isPending, isFetching, error };
};
