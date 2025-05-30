import { type FC } from "react";
import { cn } from "@/lib/utils";
import { NumberInput } from "../ui/numberInput";
import type {
  PartialPersonalProfile,
  PersonalProfile,
} from "@/data/personalIncome/personalIncomeCalc";
import { usePersonalProfile } from "@/data/personalIncome/personalIncomeHook";

export type PersonalIncomeInputProps = {
  selectValue: (profile: PersonalProfile) => number;
  updateValue: (
    value: number,
    profile: PersonalProfile
  ) => PartialPersonalProfile;
  min: number | ((profile: PersonalProfile) => number);
  max: number | ((profile: PersonalProfile) => number);
  step: number | ((profile: PersonalProfile) => number);
  unit: string;
  className?: string;
};

export const PersonalIncomeInput: FC<PersonalIncomeInputProps> = ({
  selectValue,
  updateValue,
  min,
  max,
  step,
  unit,
  className,
}) => {
  const [personalProfile, setPersonalProfile] = usePersonalProfile();
  return (
    <NumberInput
      value={[selectValue(personalProfile)]}
      onValueCommit={(value) =>
        value[0] !== undefined &&
        setPersonalProfile(updateValue(value[0], personalProfile))
      }
      min={typeof min === "function" ? min(personalProfile) : min}
      max={typeof max === "function" ? max(personalProfile) : max}
      step={typeof step === "function" ? step(personalProfile) : step}
      unit={unit}
      className={cn(className)}
    />
  );
};

export const selectTaxCoefficient = (
  taxCoefficient: keyof Omit<PersonalProfile["incomeTaxCoefficients"], string>
) => {
  return (profile: PersonalProfile) =>
    profile.incomeTaxCoefficients[taxCoefficient] * profile.netIncome;
};

export const updateTaxCoefficient = (
  taxCoefficient: keyof Omit<PersonalProfile["incomeTaxCoefficients"], string>
) => {
  return (value: number, profile: PersonalProfile) => ({
    incomeTaxCoefficients: {
      [taxCoefficient]: value / profile.netIncome,
    },
  });
};
