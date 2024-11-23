import { parseCsv } from "@/lib/utils";
import sectorsCsv from "./sectors_table.csv?raw";
import typesCsv from "./types_table.csv?raw";
import officesCsv from "./offices_table.csv?raw";
import { createServerFn } from "@tanstack/start";
import memoryDriver from "unstorage/drivers/memory";
import { createStorage } from "unstorage";

export type SectorsTableRecord = {
  id: number;
  name_short: string;
  name: string;
  name_long: string;
};

export type TypesTableRecord = {
  id: number;
  name_short: string;
  name: string;
  name_long: string;
};

export type OfficesTableRecord = {
  id: number;
  name: string;
};

export type ExpensesTables = {
  sectors: Record<string, SectorsTableRecord>;
  types: Record<string, TypesTableRecord>;
  offices: Record<string, OfficesTableRecord>;
};

export const getSectorsTable = createServerFn(
  "GET",
  async (): Promise<Record<string, SectorsTableRecord>> => {
    return parseCsv<SectorsTableRecord, Record<string, SectorsTableRecord>>(
      sectorsCsv,
      undefined,
      (record, acc) => {
        if (acc) {
          acc[record.id] = record;
          return acc;
        } else {
          return { [record.id]: record };
        }
      }
    );
  }
);

export const getTypesTable = createServerFn(
  "GET",
  async (): Promise<Record<string, TypesTableRecord>> => {
    return parseCsv<TypesTableRecord, Record<string, TypesTableRecord>>(
      typesCsv,
      undefined,
      (record, acc) => {
        if (acc) {
          acc[record.id] = record;
          return acc;
        } else {
          return { [record.id]: record };
        }
      }
    );
  }
);

export const getOfficesTable = createServerFn(
  "GET",
  async (): Promise<Record<string, OfficesTableRecord>> => {
    return parseCsv<OfficesTableRecord, Record<string, OfficesTableRecord>>(
      officesCsv,
      undefined,
      (record, acc) => {
        if (acc) {
          acc[record.id] = record;
          return acc;
        } else {
          return { [record.id]: record };
        }
      }
    );
  }
);

export const kvMemoryStorage = createStorage<ExpensesTables>({
  driver: memoryDriver(),
});

export const getExpensesTables = createServerFn(
  "GET",
  async (): Promise<ExpensesTables> => {
    const cached = await kvMemoryStorage.getItem("expenses_tables");
    if (cached) {
      console.log("CACHE(getExpensesTables): HIT");
      return cached;
    }
    console.log("CACHE(getExpensesTables): MISS");

    const [sectors, types, offices] = await Promise.all([
      getSectorsTable(),
      getTypesTable(),
      getOfficesTable(),
    ]);

    await kvMemoryStorage.setItem("expenses_tables", {
      sectors,
      types,
      offices,
    });
    return { sectors, types, offices };
  }
);
