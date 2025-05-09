import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Progress } from "../ui/progress";

import { usePersonalIncome } from "@/data/personalIncome/personalIncomeHook";
import Skeleton from "react-loading-skeleton";
import { Button } from "../ui/button";
import { RiArrowUpSLine } from "react-icons/ri";

export const PersonalIncomeThumbnail: FC<{
  className?: string;
  opened?: boolean;
  onToggle?: () => void;
}> = ({ className, opened, onToggle }) => {
  const { personalIncome, totalPersonalContributions } = usePersonalIncome();

  const {
    indirectTaxes,
    payrollDeduction,
    employerContributions,
    generalContributions,
    perceivedNetIncome,
  } = personalIncome ?? {};

  return (
    <div className={cn("flex items-center p-3 pb-4")}>
      <div className="flex grow flex-col overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-2 text-xs text-stone-400",
            className
          )}
        >
          {totalPersonalContributions ? (
            formatCurrency(totalPersonalContributions)
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
          {perceivedNetIncome ? (
            formatCurrency(perceivedNetIncome)
          ) : (
            <Skeleton width="4em" />
          )}
        </div>
        <div className="flex justify-between gap-3 text-xs text-stone-400">
          <div className="flex-1 truncate">
            {personalIncome ? (
              "odvedete měsíčně měsíčně státu"
            ) : (
              <Skeleton width="8em" />
            )}
          </div>
          <div className="flex-1 truncate">
            {personalIncome ? "čistého vám zbyde" : <Skeleton width="8em" />}
          </div>
        </div>
      </div>
      <Button
        className="shrink-0 grow-0"
        variant="ghost"
        size="sm"
        onClick={onToggle}
      >
        <RiArrowUpSLine
          className={cn({ "rotate-180 transition-transform": opened })}
        />
      </Button>
    </div>
  );
};
