import { type FC } from "react";
import { ExpenseItem } from "../ExpensesExplorer/ExpenseItem";
import { useExpense } from "@/data/expenses/expenses";
import { Explorer } from "../Explorer/Explorer";
import {
  useUrlExpenseSplat,
  type ExpenseKey,
} from "@/data/expenses/expenseDimensions";

type ExpensesExplorerProps = {
  className?: string;
};

export const ExpensesExplorer: FC<ExpensesExplorerProps> = ({ className }) => {
  const { expenseKey: urlExpenseKey } = useUrlExpenseSplat();
  const { data: expense } = useExpense(urlExpenseKey);

  // better to use parentKey from urlExpenseKey for performance
  const parentKey =
    urlExpenseKey.length > 0 ? urlExpenseKey.slice(0, -1) : undefined;

  return (
    <Explorer<ExpenseKey>
      ExplorerItemComponent={ExpenseItem}
      subjectKey={urlExpenseKey}
      parentKey={parentKey}
      childrenKeys={expense?.children}
      className={className}
    />
  );
};
