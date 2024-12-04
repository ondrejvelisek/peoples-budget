import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { type SimpleQueryResult } from "@/lib/utils";
import incomes2025Csv from "./incomes_2025.csv?raw";
import { createServerFn } from "@tanstack/start";
import { getItem, type Item } from "../items";
import {
  useChildrenIncomeDimension,
  useUrlIncomeSplat,
  type IncomeDimension,
  type IncomeKey,
} from "./incomeDimensions";

export type IncomeItem = Item<IncomeDimension>;

export const getIncome = createServerFn()
  .validator(
    (data: { incomeKey: IncomeKey; childrenDimension?: IncomeDimension }) =>
      data
  )
  .handler(async ({ data }): Promise<IncomeItem> => {
    return await getItem(
      "income",
      incomes2025Csv,
      "Všechny příjmy",
      data.incomeKey,
      data.childrenDimension
    );
  });

export const incomeQueryOptions = (
  incomeKey: IncomeKey,
  childrenDimension?: IncomeDimension
) =>
  queryOptions({
    queryKey: ["income", incomeKey, childrenDimension],
    queryFn: async () => getIncome({ data: { incomeKey, childrenDimension } }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useIncome = (
  incomeKey: IncomeKey = []
): SimpleQueryResult<IncomeItem> => {
  const splat = useUrlIncomeSplat();
  const childrenDimension = useChildrenIncomeDimension(splat, incomeKey);
  const { data, isPending, isFetching, error } = useQuery(
    incomeQueryOptions(incomeKey, childrenDimension)
  );
  return { data, isPending, isFetching, error };
};
