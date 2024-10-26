import { parseCsv } from "@/lib/utils";
import sectorsCsv from "./sectors_table.csv?raw";
import typesCsv from "./types_table.csv?raw";
import officesCsv from "./offices_table.csv?raw";
import { createServerFn } from "@tanstack/start";
import { FlatCache } from "flat-cache";

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

const cache = new FlatCache({
  ttl: 30 * 24 * 60 * 60 * 1000, // 1 month
  lruSize: 1000,
  expirationInterval: 24 * 60 * 1000 * 60, // 1 day
});

export const getExpensesTables = createServerFn(
  "GET",
  async (): Promise<ExpensesTables> => {
    const cached = cache.get<ExpensesTables | undefined>("expenses_tables");
    if (cached) {
      return cached;
    }

    const [sectors, types, offices] = await Promise.all([
      getSectorsTable(),
      getTypesTable(),
      getOfficesTable(),
    ]);

    cache.set("expenses_tables", { sectors, types, offices });
    return { sectors, types, offices };
  }
);
