import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { getPersonalIncome } from "@/data/incomes/perceivedIncomeCalc";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const IncomeThumbnail: FC<{
  className?: string;
}> = ({ className }) => {
  const {
    perceivedNetIncome,
    indirectTaxes,
    payrollDeduction,
    employerContributions,
  } = getPersonalIncome([], 43000);

  const totalContributions =
    indirectTaxes + payrollDeduction + employerContributions;

  return (
    <div
      className={cn(
        "flex min-h-10 items-center gap-2 px-3 text-2xs text-stone-400",
        className
      )}
    >
      <Tooltip>
        <TooltipTrigger>{formatCurrency(perceivedNetIncome)}</TooltipTrigger>
        <TooltipContent>Vnímaný čistý příjem</TooltipContent>
      </Tooltip>
      <Progress
        className="mr-1 h-1"
        indicatorsProps={[
          {
            className: "text-lime-400",
            value: perceivedNetIncome,
            description: "Vnímaný čistý příjem",
          },
          {
            className: "text-amber-400",
            value: indirectTaxes,
            description: "DPH a Spotřební daně",
          },
          {
            className: "text-orange-400",
            value: payrollDeduction,
            description: "Odvody zaměstnance",
          },
          {
            className: "text-rose-500",
            value: employerContributions,
            description: "Odvody zaměstnavatele",
          },
        ]}
      />
      <Tooltip>
        <TooltipTrigger>{formatCurrency(totalContributions)}</TooltipTrigger>
        <TooltipContent>Celkové odvody státu</TooltipContent>
      </Tooltip>
    </div>
  );
};
