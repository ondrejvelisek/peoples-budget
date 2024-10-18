import { type FC } from "react";
import { cn } from "@/lib/utils";
import { useExpense } from "@/data/expenses";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";

type ExpenseItemMeterProps = {
  amount: number;
  parentAmount: number;
  className?: string;
  relation: "parent" | "subject" | "child";
};

export const ExpenseItemMeter: FC<ExpenseItemMeterProps> = ({
  amount,
  parentAmount,
  className,
  relation = "subject",
}) => {
  const { data: rootExpense } = useExpense();
  const localPercentage = amount / parentAmount;
  const globalPercentage = rootExpense?.amount
    ? amount / rootExpense?.amount
    : 0;

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 h-1 rounded transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "h-0": relation === "parent",
          "bg-neutral-200/80 mx-2": relation === "subject",
        },
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-20 h-full rounded bg-sky-200 transition-all",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${localPercentage * 100}%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 z-30 h-full rounded bg-sky-400 transition-all",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${globalPercentage * 100}%)`,
        }}
      />
    </div>
  );
};
