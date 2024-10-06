import { type FC } from "react";
import { cn } from "@/lib/utils";
import { calcAmount, expenses } from "@/data/expenses";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";
import { useMounted } from "@mantine/hooks";

type ExpenseItemMeterProps = {
  amount: number;
  className?: string;
  relation: "parent" | "subject" | "child";
};

export const ExpenseItemMeter: FC<ExpenseItemMeterProps> = ({
  amount,
  className,
  relation = "subject",
}) => {
  const percentage = amount / calcAmount(expenses);
  const mounted = useMounted();

  return (
    <div
      className={cn(
        "absolute inset-0 h-1 rounded transition-all",
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
          "h-full rounded bg-sky-400 transition-all",
          {
            "bg-sky-200": relation === "subject",
          },
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: mounted ? `max(0.25rem, ${percentage * 100}%)` : "0px",
        }}
      />
    </div>
  );
};
