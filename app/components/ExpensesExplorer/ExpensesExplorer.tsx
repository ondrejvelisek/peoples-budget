import { type FC } from "react";
import { Button } from "../ui/button";
import { RiArrowLeftLine } from "react-icons/ri";
import { ExpenseItem } from "./ExpenseItem";
import { calcAmount, useExpense } from "@/data/expenses";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const ExpensesExplorer: FC<{
  expenseName?: string;
}> = ({ expenseName }) => {
  const [expense, amount, parent] = useExpense(expenseName);

  if (!expense) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4">
      <header className="px-2">
        {parent && (
          <Button
            variant="ghost"
            size="sm"
            className="-mx-3 -my-2 text-xs font-normal text-neutral-400"
            asChild
          >
            <Link to="/2024/$expenseName" params={{ expenseName: parent.name }}>
              <RiArrowLeftLine /> {parent.title}
            </Link>
          </Button>
        )}
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl leading-tight md:text-2xl">{expense.title}</h2>
          <span>{formatCurrency(amount)}</span>
        </div>
      </header>
      {"children" in expense && (
        <ul className="flex flex-col gap-3">
          {expense.children.map((child) => (
            <ExpenseItem
              key={child.name}
              name={child.name}
              title={child.title}
              amount={calcAmount(child)}
              percentage={calcAmount(child) / amount}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
