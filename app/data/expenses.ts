import { keyBy, sum } from "lodash";
import Papa from "papaparse";
import expenses2025Csv from "./expenses_2025.csv?url";
import sectorsTableCsv from "./sectors_table.csv?url";
import typesTableCsv from "./types_table.csv?url";
import officesTableCsv from "./offices_table.csv?url";
import { useQuery } from "@tanstack/react-query";
import type { SimpleQueryResult } from "@/lib/utils";

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
>(fileUrl: string): Promise<Array<T>> {
  return new Promise<Array<T>>((resolve, reject) =>
    Papa.parse<T>(fileUrl, {
      download: true,
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

type SectorsTableRecord = {
  id: number;
  name_short: string;
  name: string;
  name_long: string;
};

type TypesTableRecord = {
  id: number;
  name_short: string;
  name: string;
  name_long: string;
};

type OfficesTableRecord = {
  id: number;
  name: string;
};

type ExpensesData = {
  expenses: Array<ExpensesDataRecord>;
  sectors: Record<string, SectorsTableRecord>;
  types: Record<string, TypesTableRecord>;
  offices: Record<string, OfficesTableRecord>;
};

export const useExpensesData = (): SimpleQueryResult<ExpensesData> => {
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ["loadCsv", expenses2025Csv],
    queryFn: async () => {
      const expenses = await parseCsv<ExpensesDataRecord>(expenses2025Csv);
      const sectorsTable = await parseCsv<SectorsTableRecord>(sectorsTableCsv);
      const sectors = keyBy(sectorsTable, "id");
      const typesTable = await parseCsv<TypesTableRecord>(typesTableCsv);
      const types = keyBy(typesTable, "id");
      const officesTable = await parseCsv<OfficesTableRecord>(officesTableCsv);
      const offices = keyBy(officesTable, "id");
      return { expenses, sectors, types, offices };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 1000, //
  });
  return { data, isPending, isFetching, error };
};

export const useExpenseKeyData = (
  expenseKey: ExpenseKey
): SimpleQueryResult<ExpensesData> => {
  const result = useExpensesData();
  if (!result.data) {
    return result;
  }

  const {
    data: { expenses, ...restData },
    ...restResult
  } = result;

  const filteredExpenses = expenses.filter((expense) =>
    expenseKey.every(({ dimension, id }) => {
      if (dimension === "odvetvi") {
        return String(expense.sector_id).startsWith(id);
      }
      if (dimension === "druh") {
        return String(expense.type_id).startsWith(id);
      }
      if (dimension === "urad") {
        return String(expense.office_id).startsWith(id);
      }
    })
  );

  return {
    data: { expenses: filteredExpenses, ...restData },
    ...restResult,
  };
};

export const useExpenseChildren = (
  expenseKey: ExpenseKey
): SimpleQueryResult<Array<ExpenseKey>> => {
  const { data, ...restResult } = useExpenseKeyData(expenseKey);
  const childrenDimension = useChildrenExpenseDimension(expenseKey.length);

  if (!data || !childrenDimension) {
    return {
      data: [],
      ...restResult,
    };
  }

  const { expenses } = data;

  const numOfSectorDimensions =
    expenseKey.filter(({ dimension }) => dimension === "odvetvi").length +
    (childrenDimension === "odvetvi" ? 1 : 0);
  const numOfSectorChars = numOfSectorDimensions;

  const numOfTypeDimensions =
    expenseKey.filter(({ dimension }) => dimension === "druh").length +
    (childrenDimension === "druh" ? 1 : 0);
  const numOfTypeChars =
    numOfTypeDimensions === 0 ? 0 : numOfTypeDimensions + 1;

  const numOfOfficeDimensions =
    expenseKey.filter(({ dimension }) => dimension === "urad").length +
    (childrenDimension === "urad" ? 1 : 0);
  const numOfOfficeChars =
    numOfOfficeDimensions === 0 ? 0 : numOfOfficeDimensions === 1 ? 3 : 7;

  const grouped = Object.groupBy(
    expenses,
    ({ sector_id, type_id, office_id }) => {
      return `${String(sector_id).slice(0, numOfSectorChars)}/${String(type_id).slice(0, numOfTypeChars)}/${String(office_id).slice(0, numOfOfficeChars)}`;
    }
  );

  const childrenData = Object.entries(grouped)
    .map(([key, expenses = []]) => {
      const [sectorId, typeId, officeId] = key.split("/");
      const amount = sum(expenses.map((expense) => expense.amount));
      if (childrenDimension === "odvetvi") {
        return { id: sectorId, amount } as const;
      }
      if (childrenDimension === "druh") {
        return { id: typeId, amount } as const;
      }
      if (childrenDimension === "urad") {
        return { id: officeId, amount } as const;
      }
      throw new Error(`Invalid dimension: ${childrenDimension}`);
    })
    .sort((a, b) => b.amount - a.amount);

  const children = childrenData.map(({ id }) => [
    ...expenseKey,
    { dimension: childrenDimension, id },
  ]);

  return {
    data: children,
    ...restResult,
  };
};

export const useChildrenExpenseDimension = (
  level?: number
): ExpenseDimension | undefined => {
  if (level === undefined) {
    return undefined;
  }
  const dimensions = [
    "odvetvi",
    "odvetvi",
    "odvetvi",
    "druh",
    "druh",
    "druh",
    "urad",
    "urad",
  ] as const;
  return dimensions[level];
};

export const useExpense = (
  expenseKey?: ExpenseKey
): SimpleQueryResult<ExpenseItem> => {
  const { data, ...restResult } = useExpenseKeyData(expenseKey ?? []);
  const { data: children } = useExpenseChildren(expenseKey ?? []);
  const childrenDimension = useChildrenExpenseDimension(
    expenseKey?.length ?? 0
  );

  if (!data || !children) {
    return {
      data: undefined,
      ...restResult,
    };
  }

  const { expenses, sectors, types, offices } = data;

  const amount = sum(expenses.map((expense) => expense.amount));

  const rootExpense = {
    key: [],
    title: "Všechny výdaje",
    amount,
    children,
    childrenDimension,
    parent: undefined,
  };

  if (!expenseKey) {
    return {
      data: rootExpense,
      ...restResult,
    };
  }

  const lastKey = expenseKey.at(-1);

  if (!lastKey) {
    return {
      data: rootExpense,
      ...restResult,
    };
  }

  let title = "";
  if (lastKey.dimension === "odvetvi") {
    const sector = sectors[lastKey.id];
    title = sector.name;
  } else if (lastKey.dimension === "druh") {
    const type = types[lastKey.id];
    title = type.name;
  } else if (lastKey.dimension === "urad") {
    const office = offices[lastKey.id];
    title = office.name;
  }

  return {
    data: {
      key: expenseKey,
      title,
      amount,
      children,
      childrenDimension,
      parent: expenseKey.slice(0, -1),
    },
    ...restResult,
  };
};
