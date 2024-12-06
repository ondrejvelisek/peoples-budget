import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { getPersonalIncome } from "@/data/incomes/perceivedIncomeCalc";

export const IncomeThumbnail: FC<{
  className?: string;
}> = ({ className }) => {
  const {
    perceivedNetIncome,
    indirectTaxes,
    payrollDeduction,
    employerContributions,
  } = getPersonalIncome([], 93000);

  const totalContributions =
    indirectTaxes + payrollDeduction + employerContributions;

  const perc = perceivedNetIncome / (perceivedNetIncome + totalContributions);

  return (
    <div
      className={cn(
        "flex min-h-10 items-center gap-4 px-3 text-2xs text-stone-400",
        className
      )}
    >
      {formatCurrency(perceivedNetIncome)}
      <Progress
        value={perc * 100}
        className="mr-1 h-1 bg-rose-400"
        indicatorProps={{ className: "bg-lime-300" }}
      />
      {formatCurrency(totalContributions)}
    </div>
  );
};
