import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { useMyQuery, type SimpleQueryResult } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { getItem, type Item } from "../items";
import {
  useChildrenIncomeDimension,
  useUrlIncomeSplat,
  type IncomeDimension,
  type IncomeKey,
} from "./incomeDimensions";
import { useBudgetName } from "@/lib/budget";
import { useHealthInsurance } from "@/components/Explorer/HealthInsuranceSwitcher";
import { getBudgetMetadata } from "../metadata/metadataHooks";

export type IncomeItem = Item<IncomeDimension>;

export const getIncome = createServerFn()
  .inputValidator(
    (data: {
      budgetName: string;
      incomeKey: IncomeKey;
      healthInsurance: boolean;
      childrenDimension?: IncomeDimension;
    }) => data
  )
  .handler(async ({ data }): Promise<IncomeItem> => {
    const budgetMetadata = await getBudgetMetadata(data.budgetName);
    const item = await getItem(
      data.budgetName,
      "incomes",
      "Příjmy rozpočtu " + budgetMetadata.title,
      data.incomeKey,
      data.healthInsurance,
      data.childrenDimension
    );
    if (!item) {
      throw new Error("Income item not found by key");
    }
    return item;
  });

export const incomeQueryOptions = (
  budgetName: string,
  incomeKey: IncomeKey,
  healthInsurance: boolean,
  childrenDimension?: IncomeDimension
) =>
  queryOptions({
    queryKey: ["income", incomeKey, healthInsurance, childrenDimension],
    queryFn: async () =>
      getIncome({
        data: { budgetName, incomeKey, healthInsurance, childrenDimension },
      }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });

export const useIncome = (
  incomeKey: IncomeKey = []
): SimpleQueryResult<IncomeItem> => {
  const budgetName = useBudgetName();
  const splat = useUrlIncomeSplat();
  const [healthInsurance] = useHealthInsurance();
  const childrenDimension = useChildrenIncomeDimension(splat, incomeKey);
  const { data, isPending, isFetching, error } = useMyQuery(
    incomeQueryOptions(
      budgetName,
      incomeKey,
      healthInsurance,
      childrenDimension
    )
  );
  return { data, isPending, isFetching, error };
};
