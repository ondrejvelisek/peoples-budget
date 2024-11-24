import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ExpenseDimensionSwitcher } from "./ExpenseDimensionSwitcher";
import { ANIMATION_DURATION_CLASS } from "../Explorer/Explorer";

type ExpenseItemRightProps = {
  amount?: number;
  className?: string;
  relation: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const ExpenseItemRight: FC<ExpenseItemRightProps> = ({
  className,
  relation = "subject",
}) => {
  return (
    <div
      className={cn(
        "max-w-[50%] max-h-12 overflow-hidden text-right opacity-100 transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "max-w-0 max-h-0 opacity-0 grow-0": relation !== "subject",
        },
        className
      )}
    >
      <ExpenseDimensionSwitcher />
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
