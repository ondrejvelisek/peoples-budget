import { type FC } from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useChildrenExpenseDimension, useExpense, type ExpenseKey } from "@/data/expenses";
import { ExpenseItemLeft } from "./ExpenseItemLeft";
import { ExpenseItemRight } from "./ExpenseItemRight";
import { ExpenseItemMeter } from "./ExpenseItemMeter";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";

type ExpenseItemProps = {
  expenseKey: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  expenseKey,
  className,
  relation = "subject",
}) => {
  const { data: expense } = useExpense(expenseKey);
  const { data: parentExpense } = useExpense(expense?.parent);
  const expenseDimension = useChildrenExpenseDimension(expenseKey.length);

  if (!expense || !parentExpense) {
    return null; // TODO loading and error
  }

  const isRoot = expenseKey.length === 0;

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "relative block h-auto w-full bg-white transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "px-2 py-1": relation === "parent",
          "py-2 px-2 pb-5 active:bg-transparent hover:bg-transparent":
            relation === "subject",
          "p-2": relation === "child",
        },
        className
      )}
    >
      <Link
        to="/2024/$"
        params={{
          _splat: { expenseKey, expenseDimension },
        }}
        disabled={relation === "subject"}
      >
        <div className="flex grow items-baseline justify-between gap-4">
          <ExpenseItemLeft
            title={expense.title}
            amount={expense.amount}
            relation={relation}
          />

          <ExpenseItemRight
            amount={expense.amount}
            relation={relation}
            className="shrink-0"
          />
        </div>

        <ExpenseItemMeter
          amount={expense.amount}
          parentAmount={parentExpense.amount}
          className={cn("absolute inset-0")}
          relation={isRoot ? "parent" : relation}
        />
      </Link>
    </Button>
  );
};
