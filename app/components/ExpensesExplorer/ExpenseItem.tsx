import { type FC } from "react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { calcAmount, useExpense } from "@/data/expenses";
import { ExpenseItemLeft } from "./ExpenseItemLeft";
import { ExpenseItemRight } from "./ExpenseItemRight";
import { ExpenseItemMeter } from "./ExpenseItemMeter";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";

type ExpenseItemProps = {
  name: string;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  name,
  className,
  relation = "subject",
}) => {
  const [expense, amount, ancestors, examples] = useExpense(name);
  const [, parentAmount] = useExpense(ancestors.at(0));
  const isRoot = ancestors.length === 0;
  const example = examples.at(0);
  const title = expense?.title;

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
        to="/2024/$expenseName"
        params={{ expenseName: name }}
        disabled={relation === "subject"}
      >
        <div className="flex grow items-baseline justify-between gap-4">
          <ExpenseItemLeft title={title} amount={amount} relation={relation} />

          <ExpenseItemRight
            example={example}
            amount={amount}
            relation={relation}
            className="shrink-0"
          />
        </div>

        <ExpenseItemMeter
          amount={amount}
          parentAmount={parentAmount}
          className={cn("absolute inset-0")}
          relation={isRoot ? "parent" : relation}
        />
      </Link>
    </Button>
  );
};
