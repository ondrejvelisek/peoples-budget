import { queryOptions } from "@tanstack/react-query";
import { getBudgetFile } from "../files/files";
import { parseCsv, useMyQuery } from "@/lib/utils";

type Metadata = {
  title: string;
  value: string;
};

export const getBudgetMetadata = async (
  budgetName: string
): Promise<Metadata> => {
  const metadataCsv = await getBudgetFile(budgetName, "metadata");
  const metadata = (await parseCsv<
    { key: string; value: string },
    Partial<Metadata>
  >(metadataCsv, undefined, (record, acc) => {
    if (acc) {
      acc[record.key as keyof Partial<Metadata>] = record.value;
      return acc;
    } else {
      return { [record.key]: record.value };
    }
  })) as Metadata;
  return metadata;
};

export const budgetMetadataQueryOptions = (budgetName: string) =>
  queryOptions({
    queryKey: ["budgetMetadata", budgetName],
    queryFn: () => getBudgetMetadata(budgetName),
  });

export const useBudgetMetadata = (budgetName: string) => {
  return useMyQuery(budgetMetadataQueryOptions(budgetName));
};
