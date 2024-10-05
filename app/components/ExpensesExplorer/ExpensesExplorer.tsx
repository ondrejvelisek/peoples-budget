import { type FC } from "react";
import { Button } from "../ui/button";
import { RiArrowLeftLine } from "react-icons/ri";
import { ExpenseItem } from "./ExpenseItem";

export const ExpensesExplorer: FC = () => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-4">
      <header className="px-2">
        <Button
          variant="ghost"
          size="sm"
          className="-mx-3 -my-2 text-xs font-normal text-neutral-400"
        >
          <RiArrowLeftLine /> Výdaje vládního rozpočtu 2024
        </Button>
        <h2 className="text-xl leading-tight md:text-2xl">Doprava</h2>
      </header>
      <ul className="flex flex-col gap-3">
        <ExpenseItem title="Silnice" amount={120000} />
        <ExpenseItem title="Železnice" amount={120000} />
        <ExpenseItem title="Silnice" amount={120000} />
        <ExpenseItem title="Železnice" amount={120000} />
        <ExpenseItem title="Silnice" amount={120000} />
        <ExpenseItem title="Železnice" amount={120000} />
        <ExpenseItem title="Silnice" amount={120000} />
        <ExpenseItem title="Železnice" amount={120000} />
        <ExpenseItem title="Silnice" amount={120000} />
        <ExpenseItem title="Železnice" amount={120000} />
      </ul>
    </div>
  );
};
