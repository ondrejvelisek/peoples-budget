import _ from "lodash";
import Papa from "papaparse";
import expenses2025Csv from "./expenses_2025.csv?url";
import sectorsTableCsv from "./sectors_table.csv?url";
import typesTableCsv from "./types_table.csv?url";
import { useQuery } from "@tanstack/react-query";

export type ExpenseItemExample = {
  title: string;
  amount: number;
};

type ExpenseBaseItem = {
  title: string;
  name: string;
};

type ExpenseLeafItem = ExpenseBaseItem & {
  amount: number;
  examples: ExpenseItemExample[];
};

type ExpenseInnerItem = ExpenseBaseItem & {
  children: ExpenseItem[];
};

export type ExpenseItem = ExpenseInnerItem | ExpenseLeafItem;

async function parseCsv(
  fileUrl: string
): Promise<Array<Record<string, string | number>>> {
  return new Promise<Array<Record<string, string | number>>>(
    (resolve, reject) =>
      Papa.parse<Record<string, string | number>>(fileUrl, {
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

export const useExpensesData = (): ExpenseItem | undefined => {
  const { data: expensesData } = useQuery({
    queryKey: ["loadCsv", expenses2025Csv],
    queryFn: () => parseCsv(expenses2025Csv),
  });
  const { data: sectorsTable } = useQuery({
    queryKey: ["loadCsv", sectorsTableCsv],
    queryFn: () => parseCsv(sectorsTableCsv),
    select(sectorsData) {
      return _(sectorsData)
        .keyBy("id")
        .mapValues("name")
        .mapValues((e) => e as string)
        .value();
    },
  });
  const { data: typesTable } = useQuery({
    queryKey: ["loadCsv", typesTableCsv],
    queryFn: () => parseCsv(typesTableCsv),
    select(sectorsData) {
      return _(sectorsData)
        .keyBy("id")
        .mapValues("name")
        .mapValues((e) => e as string)
        .value();
    },
  });

  if (expensesData && sectorsTable && typesTable) {
    const grouped = _(expensesData)
      .groupBy((row) => row["sector_id"].toString().slice(0, 1))
      .map(
        (children, sectorId): ExpenseInnerItem => ({
          title: sectorsTable[sectorId],
          name: `odvetvi-${sectorId}`,
          children: _(children)
            .groupBy((row) => row["sector_id"].toString().slice(0, 2))
            .map(
              (children, sectorId): ExpenseInnerItem => ({
                title: sectorsTable[sectorId],
                name: `odvetvi-${sectorId}-odvetvi-${sectorId}`,
                children: _(children)
                  .groupBy((row) => row["type_id"].toString().slice(0, 2))
                  .map(
                    (children, typeId): ExpenseLeafItem => ({
                      title: typesTable[typeId],
                      name: `odvetvi-${sectorId}-odvetvi-${sectorId}-druh-${typeId}`,
                      amount: _.sum(children.map((row) => row["amount"])),
                      examples: [],
                    })
                  )
                  .value(),
              })
            )
            .value(),
        })
      )
      .value();

    return {
      title: "Výdaje 2025",
      name: "vydaje",
      children: grouped,
    };
  }
};

export function findByName(
  name: string,
  item: ExpenseItem
): ExpenseItem | undefined {
  if (item.name === name) {
    return item;
  }

  if ("children" in item) {
    for (const child of item.children) {
      const found = findByName(name, child);
      if (found) {
        return found;
      }
    }
  }
}

export function findParent(
  name: string,
  root: ExpenseItem
): ExpenseItem | undefined {
  if ("children" in root) {
    for (const child of root.children) {
      if (child.name === name) {
        return root;
      }

      const found = findParent(name, child);
      if (found) {
        return found;
      }
    }
  }
}

function findAncestors(
  name: string,
  item: ExpenseItem
): Array<string> | undefined {
  if (!item) return;

  if (item.name === name) {
    return [];
  }

  if ("children" in item) {
    for (const child of item.children) {
      const ancestors = findAncestors(name, child);
      if (ancestors) {
        return [...ancestors, item.name];
      }
    }
  }

  return;
}

export function calcAmount(item: ExpenseItem): number {
  if ("amount" in item) {
    return item.amount;
  }

  return _.sum(item.children.map(calcAmount));
}

export function findExamples(item: ExpenseItem): ExpenseItemExample[] {
  if ("amount" in item) {
    return item.examples;
  }

  return item.children.flatMap(findExamples);
}

export const useExpense = (
  expenseName?: string
): [ExpenseItem, number, Array<string>, ExpenseItemExample[]] => {
  const expenses = useExpensesData();
  if (!expenses) {
    return [
      {
        title: "Výdaje 2025",
        name: "vydaje",
        children: [],
      },
      0,
      [],
      [],
    ] as const;
  }
  if (!expenseName) {
    const amount = calcAmount(expenses);
    const examples = findExamples(expenses);
    return [expenses, amount, [], examples] as const;
  }
  const expense = findByName(expenseName, expenses);
  if (!expense) {
    const amount = calcAmount(expenses);
    const examples = findExamples(expenses);
    return [expenses, amount, [], examples] as const;
  }
  const amount = calcAmount(expense);
  const ancestors = findAncestors(expenseName, expenses);
  const examples = findExamples(expense);
  if (!expense || !ancestors) {
    throw new Error("Expense not found");
  }

  return [expense, amount, ancestors, examples] as const;
};
