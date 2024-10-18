
import Papa from "papaparse";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type ExpenseDimension = "odvetvi" | "druh" | "urad";

export type ExpenseKey = Array<{
  dimension: ExpenseDimension;
  id: string;
}>;

export type ExpenseItem = {
  key: ExpenseKey;
  title: string;
  amount: number;
  children: Array<ExpenseKey>;
  childrenDimension?: ExpenseDimension;
  parent?: ExpenseKey;
};

async function parseCsv<
  T extends Record<string, string | number> = Record<string, string | number>,
>(csvString: string): Promise<Array<T>> {
  return new Promise<Array<T>>((resolve, reject) =>
    Papa.parse<T>(csvString, {
      header: true,
      dynamicTyping: true,
      complete(results) {
        if (results.errors.length > 0) {
          reject(results.errors);
        }
        resolve(results.data);
      },
    })
  );
}

type ExpensesDataRecord = {
  sector_id: number;
  type_id: number;
  office_id: number;
  amount: number;
};

export const expensesDataQueryOptions = () =>
  queryOptions({
    queryKey: ["loadCsv"],
    queryFn: async () => {
      const expenses2025Csv = await import("./expenses_2025.csv?raw");
      const expenses = await parseCsv<ExpensesDataRecord>(
        expenses2025Csv.default
      );
      const expenses2025Csv2 = await import("./expenses_2025.csv?raw");
      const expenses2 = await parseCsv<ExpensesDataRecord>(
        expenses2025Csv2.default
      );
      const expenses2025Csv3 = await import("./expenses_2025.csv?raw");
      const expenses3 = await parseCsv<ExpensesDataRecord>(
        expenses2025Csv3.default
      );
      const expenses2025Csv4 = await import("./expenses_2025.csv?raw");
      const expenses4 = await parseCsv<ExpensesDataRecord>(
        expenses2025Csv4.default
      );
      return { expenses, expenses2, expenses3, expenses4 } as const;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 1000, //
  });

export const useExpensesData = () => {
  const { data, isPending, isFetching, error } = useQuery(
    expensesDataQueryOptions()
  );
  return { data, isPending, isFetching, error };
};
