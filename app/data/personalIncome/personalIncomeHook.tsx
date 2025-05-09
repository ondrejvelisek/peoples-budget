import { parseCsv } from "@/lib/utils";
import {
  getPersonalIncome,
  type PersonalProfile,
} from "@/data/personalIncome/personalIncomeCalc";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecordTables, type TypesTableRecord } from "@/data/recordTables";
import type { DataRecord } from "@/data/items";
import { createServerFn } from "@tanstack/react-start";

import incomes2025Csv from "../../data/incomes/incomes_2025.csv?raw";
import { useMemo } from "react";
import { useLocalStorage } from "@mantine/hooks";

type IncomesByType = {
  incomes: Record<string, number>;
  types: Record<string, TypesTableRecord>;
};

const getIncomesByType = createServerFn().handler(
  async (): Promise<IncomesByType> => {
    const types = (await getRecordTables()).types;
    const incomes = await parseCsv<DataRecord, Record<string, number>>(
      incomes2025Csv,
      ({ type_id }) => type_id < 5000, // prijmy
      ({ type_id, amount }, acc) => {
        const accTmp = acc ?? {};
        accTmp[String(type_id)] = (accTmp[String(type_id)] ?? 0) + amount;
        return accTmp;
      }
    );

    return {
      incomes,
      types,
    };
  }
);

export const personalIncomeQueryOptions = queryOptions({
  queryKey: ["incomesByType"],
  queryFn: getIncomesByType,
  staleTime: 24 * 60 * 60 * 1000, // 24 hours
  gcTime: 60 * 60 * 1000, // 1 hour
});

export const usePersonalProfile = () => {
  return useLocalStorage<PersonalProfile>({
    key: "personal-profile",
    defaultValue: {
      netIncome: 37000,
      taxCredit: 2570, // slevy na dani
      incomeTaxCoefficients: {
        1211: 0.5, // DPH, kolik % zboži, které nakoupím spadá do snížené sazby
        1221: 0.06, // Spotrebni dan mineralnich oleju, kolik procent prijmu domacnost utrati za pohonne hmoty
        1222: 0.01, // Spotrebni dan lihu, kolik procent prijmu domacnost utrati za tvrdy alkohol
        1223: 0.01, // Spotrebni dan piva, kolik procent prijmu domacnost utrati za pivo
        1224: 0.01, // Spotrebni dan vina, kolik procent prijmu domacnost utrati za vino
        1225: 0.01, // Spotrebni dan tabaku, kolik procent prijmu domacnost utrati za tabakove vyrobky
        1229: 0.01, // SpD - zahřív.tab.výr.
        1231: 0.02, // Daň z zem.pl. a plyn
        1232: 0.005, // Daň z pevných paliv
        1233: 0.03, // Daň z elektřiny
        1333: 0.005, // P za ulož.odpadů
        1111: 1, // Změstnanec - Příjem z daně z příjmů fyzických osob placené plátci	134,200,000,000	1111
        1612: 1, // Změstnanec - Příjem z pojistného na důchodové pojištění od zaměstnanců	151,829,546,160	1612
        1615: 1, // Změstnanec - Příjem z pojistného na nemocenské pojištění od zaměstnanců	13,934,565,703	1615
        1632: 1, // Změstnanec - Pojistné na veřejné zdravotní pojištění od zaměstnanců	78,649,574,500	1632
        1611: 1, // Zaměstnavatel - Poj.důchP zamv
        1614: 1, // Zaměstnavatel - Poj.nemP-zamv
        1617: 1, // Zaměstnavatel - Přísp. SPZ zamv
        1631: 1, // Zaměstnavatel - Poj.zdravP zamv
        1112: 0, // OSVC - Příjem z daně z příjmů fyzických osob placené poplatníky	12,000,000,000	1112
        1613: 0, // OSVC - Příjem z pojistného na důchodové pojištění od osob samostatně výdělečně činných	41,416,716,943	1613
        2361: 0, // OSVC - Příjem z pojistného na nemocenské pojištění od osob samostatně výdělečně činných	230,000,000	2361
        1633: 0, // OSVC - Pojistné na veřejné zdravotní pojištění od OSVČ	21,454,369,371	1633
        1618: 0, // OSVC - Příjem z příspěvků na státní politiku zaměstnanosti od osob samostatně výdělečně činných	1,774,251,716	1618
        1113: 0, // Daně z investic a bankovních účtů - Příjem z daně z příjmů fyzických osob vybírané srážkou podle zvláštní sazby daně	23,400,000,000	1113
        2362: 0, // Příjem z dobrovolného pojistného na důchodové pojištění	320,000,000	2362
        1121: 0.5, // dane z prijmu pravnickych osob, daněný zisk řetězců podniků odhaduju jako 50 % spotřebitelských tržeb
      },
    },
  });
};

export const usePersonalIncome = () => {
  const { data, isPending, isLoading, isFetching, error } = useQuery(
    personalIncomeQueryOptions
  );

  const [personalProfile] = usePersonalProfile();

  const personalIncome = useMemo(
    // We do not want to compute this on server because we do not want personal income data leave local machine
    () => data && getPersonalIncome(data.incomes, data.types, personalProfile),
    [data, personalProfile]
  );

  if (!personalIncome) {
    return { isPending, isLoading, isFetching, error };
  }

  const totalPersonalContributions =
    personalIncome.indirectTaxes +
    personalIncome.payrollDeduction +
    personalIncome.employerContributions +
    personalIncome.generalContributions;

  return {
    personalIncome,
    totalPersonalContributions,
    isPending,
    isLoading,
    isFetching,
    error,
  };
};
