import { type FC } from "react";
import { cn } from "@/lib/utils";
import { useExpense, useExpensesData } from "@/data/expenses";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";
import { useMounted } from "@mantine/hooks";

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
  const mounted = useMounted();

  return (
    <div
      className={cn(
        "absolute inset-0 h-1 rounded transition-all z-10",
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
          "absolute h-full rounded bg-sky-200 transition-all inset-0 z-20",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: mounted ? `max(0.25rem, ${localPercentage * 100}%)` : "0px",
        }}
      />
      <div
        className={cn(
          "absolute h-full rounded bg-sky-400 transition-all inset-0 z-30",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: mounted ? `max(0.25rem, ${globalPercentage * 100}%)` : "0px",
        }}
      />
    </div>
  );
};
