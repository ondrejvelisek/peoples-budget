import { parseCsv } from "@/lib/utils";
import {
  defaultPersonalProfile,
  defaultPersonalProfileTaxCoefficients,
  getPersonalIncome,
  type PartialPersonalProfile,
  type PersonalProfile,
} from "@/data/personalIncome/personalIncomeCalc";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecordTables, type TypesTableRecord } from "@/data/recordTables";
import type { DataRecord } from "@/data/items";
import { createServerFn } from "@tanstack/react-start";

import incomes2025Csv from "../../data/incomes/incomes_2025.csv?raw";
import { useMemo } from "react";
import { useLocalStorage, useTimeout } from "@mantine/hooks";

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
