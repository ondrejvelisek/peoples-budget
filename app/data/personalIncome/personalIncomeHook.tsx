import { parseCsv } from "@/lib/utils";
import {
  defaultPersonalProfile,
  defaultPersonalProfileTaxCoefficients,
  getPersonalIncome,
  type PartialPersonalProfile,
  type PersonalProfile,
} from "@/data/personalIncome/personalIncomeCalc";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { DataRecord } from "@/data/items";
import { createServerFn } from "@tanstack/react-start";

import { useMemo } from "react";
import { useLocalStorage, useTimeout } from "@mantine/hooks";
import { getBudgetFile } from "../files/files";
import { useBudgetName } from "@/lib/budget";

type IncomesByType = {
  incomes: Record<string, number>;
  types: Record<string, IncomesTypeRecord>;
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

export type IncomesTypeRecord = {
  id: number;
  amount?: number;
  unit?: string;
  income_type?: TypeOfIncomeType;
  percentage?: number;
};

const getIncomesType = async (
  budgetName: string
): Promise<Record<string, IncomesTypeRecord>> => {
  const incomeTypesCsv = await getBudgetFile(budgetName, "income_types");
  return parseCsv<IncomesTypeRecord, Record<string, IncomesTypeRecord>>(
    incomeTypesCsv,
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
};

const getIncomesByType = createServerFn()
  .validator((data: { budgetName: string }) => data)
  .handler(async ({ data }): Promise<IncomesByType> => {
    const types = await getIncomesType(data.budgetName);
    const incomesCsv = await getBudgetFile(data.budgetName, "incomes");
    const incomesAmountByType = await parseCsv<
      DataRecord,
      Record<string, number>
    >(
      incomesCsv,
      ({ type_id }) => type_id < 5000, // prijmy
      ({ type_id, amount }, acc) => {
        const accTmp = acc ?? {};
        accTmp[String(type_id)] = (accTmp[String(type_id)] ?? 0) + amount;
        return accTmp;
      }
    );

    return {
      incomes: incomesAmountByType,
      types,
    };
  });

export const personalIncomeQueryOptions = (budgetName: string) =>
  queryOptions({
    queryKey: ["incomesByType", budgetName],
    queryFn: () => getIncomesByType({ data: { budgetName } }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 60 * 60 * 1000, // 1 hour
  });

export const usePersonalProfile = (): [
  PersonalProfile,
  (profile: PartialPersonalProfile) => void,
] => {
  const [profileData, setProfileData] = useLocalStorage<PartialPersonalProfile>(
    {
      key: "personal-profile",
      defaultValue: {},
    }
  );

  const profile = {
    ...defaultPersonalProfile,
    ...profileData,
    incomeTaxCoefficients: {
      ...defaultPersonalProfileTaxCoefficients,
      ...profileData.incomeTaxCoefficients,
    },
  };

  const setProfile = (profile: PartialPersonalProfile) => {
    setProfileData({
      ...profileData,
      ...profile,
      incomeTaxCoefficients: {
        ...profileData.incomeTaxCoefficients,
        ...profile.incomeTaxCoefficients,
      },
    });
  };

  return [profile, setProfile] as const;
};

export const usePersonalProfileNotSeenYet = (callback: () => void) => {
  const [seenProfile, setSeenProfile] = useLocalStorage<boolean>({
    key: "seen-personal-profile",
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  useTimeout(
    () => {
      if (!seenProfile) {
        setSeenProfile(true);
        callback();
      }
    },
    500,
    { autoInvoke: true }
  );
};

export const usePersonalIncome = () => {
  const budgetName = useBudgetName();
  const { data, isPending, isLoading, isFetching, error } = useQuery(
    personalIncomeQueryOptions(budgetName)
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
