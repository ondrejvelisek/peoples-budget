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

export type TypeOfIncomeType =
  | "zamestnavatel"
  | "dph"
  | "podniky"
  | "os.prijem"
  | "spotrebni"
  | "fix"
  | "pausal"
  | "majetkova";

export type TypesTableRecord = {
  id: number;
  name_short: string;
  name: string;
  name_long: string;
  amount?: number;
  unit?: string;
  income_type?: TypeOfIncomeType;
  percentage?: number;
};

export type OfficesTableRecord = {
  id: number;
  name: string;
};

export type RecordTables = {
  sectors: Record<string, SectorsTableRecord>;
  types: Record<string, TypesTableRecord>;
  offices: Record<string, OfficesTableRecord>;
};

export const getSectorsTable = createServerFn().handler(
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

export const getTypesTable = createServerFn().handler(
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

export const getOfficesTable = createServerFn().handler(
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

export const kvMemoryStorage = createStorage<RecordTables>({
  driver: memoryDriver(),
});

export const getRecordTables = createServerFn().handler(
  async (): Promise<RecordTables> => {
    const cached = await kvMemoryStorage.getItem("record_tables");
    if (cached) {
      console.log("CACHE(getRecordTables): HIT");
      return cached;
    }
    console.log("CACHE(getRecordTables): MISS");

    const [sectors, types, offices] = await Promise.all([
      getSectorsTable(),
      getTypesTable(),
      getOfficesTable(),
    ]);

    await kvMemoryStorage.setItem("record_tables", {
      sectors,
      types,
      offices,
    });
    return { sectors, types, offices };
  }
);
