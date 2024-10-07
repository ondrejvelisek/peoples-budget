import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";
import type { ExpenseItemExample } from "@/data/expenses";

type ExpenseItemRightProps = {
  example?: ExpenseItemExample;
  amount: number;
  className?: string;
  relation: "parent" | "subject" | "child";
};

export const ExpenseItemRight: FC<ExpenseItemRightProps> = ({
  amount,
  className,
  relation = "subject",
}) => {
  return (
    <div
      className={cn(
        "max-w-[50%] overflow-hidden text-right transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "max-w-0 opacity-0": relation === "parent",
        },
        className
      )}
    >
      <div className="truncate text-xs font-bold">{formatCurrency(amount)}</div>
      {/*<div
        className={cn(
          "h-[1.3em] max-w-full truncate text-xs font-normal transition-all",
          ANIMATION_DURATION_CLASS,
          {
            "h-0 opacity-0 max-w-0": relation !== "child",
          }
        )}
      >
        {example?.title}
      </div>*/}
    </div>
  );
};
