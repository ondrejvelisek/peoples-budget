import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Progress } from "../ui/progress";

import { usePersonalIncome } from "@/data/personalIncome/personalIncomeHook";
import Skeleton from "react-loading-skeleton";

export const PersonalIncomeThumbnail: FC<{
  className?: string;
}> = ({ className }) => {
  const { personalIncome, totalPersonalContributions } = usePersonalIncome();

  const {
    indirectTaxes,
    payrollDeduction,
    employerContributions,
    generalContributions,
    perceivedNetIncome,
  } = personalIncome ?? {};

  return (
    <div className="flex flex-col p-3">
      <div
        className={cn(
          "flex items-center gap-2 text-2xs text-stone-400",
          className
        )}
      >
        {perceivedNetIncome ? (
          formatCurrency(perceivedNetIncome)
        ) : (
          <Skeleton width="4em" />
        )}
        <Progress
          className="mr-1 h-1"
          indicatorsProps={
            !personalIncome
              ? [
                  {
                    className: "text-stone-200",
                    value: 1,
                    description: "Počítám...",
                  },
                ]
              : [
                  {
                    className: "text-rose-500",
                    value: indirectTaxes ?? 0,
                    description:
                      "DPH, Spotřební daně a Daně z příjmů právnických osob. Ovlivňují cenu zboží a služeb",
                  },
                  {
                    className: "text-rose-500",
                    value: payrollDeduction ?? 0,
                    description:
                      "Odvody z hrubého platu zaměstnance nebo zisku OSVČ",
                  },
                  {
                    className: "text-rose-500",
                    value: employerContributions ?? 0,
                    description:
                      "Odvody zaměstnavatele (Právnické osoby) za zaměstnance",
                  },
                  {
                    className: "text-rose-500",
                    value: generalContributions ?? 0,
                    description: "Ostatní odvody",
                  },
                  {
                    className: "text-lime-400",
                    value: perceivedNetIncome ?? 0,
                    description: "Vnímaný čistý příjem",
                  },
                ]
          }
        />
        {totalPersonalContributions ? (
          formatCurrency(totalPersonalContributions)
        ) : (
          <Skeleton width="4em" />
        )}
      </div>
      <div className="flex justify-between text-2xs text-stone-400 ">
        <div>
          {personalIncome ? "odvedete státu" : <Skeleton width="8em" />}
        </div>
        <div>
          {personalIncome ? "čistého vám zbyde" : <Skeleton width="8em" />}
        </div>
      </div>
    </div>
  );
};
