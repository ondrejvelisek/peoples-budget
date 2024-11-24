import { type FC } from "react";
import { cn } from "@/lib/utils";
import { useExpense, type ExpenseKey } from "@/data/expenses";
import { ExpenseItemLeft } from "./ExpenseItemLeft";
import { ExpenseItemRight } from "./ExpenseItemRight";
import { ExpenseItemMeter } from "./ExpenseItemMeter";
import { ANIMATION_DURATION_CLASS } from "../Explorer/Explorer";

type ExpenseItemProps = {
  itemKey?: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  itemKey: expenseKey,
  className,
  relation = "parent",
  isLoading = false,
}) => {
  const { data: expense, isPending } = useExpense(expenseKey);
  const { data: parentExpense, isPending: isParentPending } = useExpense(
    expense?.parent
  );
  const isAnyLoading = isPending || isParentPending || isLoading;
  const isRoot = expenseKey?.length === 0;

  return (
    <div
      className={cn(
        "relative block h-auto w-full bg-white transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "px-2 pt-1": relation === "parent",
          "pt-2 px-2 pb-5 active:bg-transparent hover:bg-transparent":
            relation === "subject",
          "px-2 pt-2 pb-2": relation === "child",
        },
        className
      )}
    >
      <div className="flex grow justify-between gap-4">
        <ExpenseItemLeft
          expenseKey={expenseKey}
          title={expense?.title}
          amount={expense?.amount}
          relation={relation}
          isLoading={isAnyLoading}
        />

        <ExpenseItemRight
          amount={expense?.amount}
          relation={relation}
          className="shrink-0"
          isLoading={isAnyLoading}
        />
      </div>

      <ExpenseItemMeter
        amount={expense?.amount}
        parentAmount={parentExpense?.amount}
        className={cn("absolute inset-0")}
        relation={isRoot ? "parent" : relation}
        isLoading={isAnyLoading}
      />
    </div>
  );
};
