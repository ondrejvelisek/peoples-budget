import { type FC } from "react";
import { ExpenseItem } from "../ExpensesExplorer/ExpenseItem";
import { useExpense } from "@/data/expenses/expenses";
import { Explorer } from "../Explorer/Explorer";
import {
  useUrlExpenseSplat,
  type ExpenseKey,
} from "@/data/expenses/expenseDimensions";

type ExpensesExplorerProps = {
  itemKey?: ExpenseKey;
  isParentFetching?: boolean;
  isFetching?: boolean;
  className?: string;
};

export const ExpensesExplorer: FC<ExpensesExplorerProps> = ({
  itemKey = [],
  isParentFetching = false,
  className,
}) => {
  const { data: expense, isPending, isFetching } = useExpense(itemKey);

  const isLoading = isPending;

  const { expenseKey: urlExpenseKey } = useUrlExpenseSplat();

  return (
    <Explorer<ExpenseKey>
      itemKey={itemKey}
      ExplorerComponent={ExpensesExplorer}
      ExplorerItemComponent={ExpenseItem}
      subjectKey={urlExpenseKey}
      childrenKeys={expense?.children}
      childrenDimension={expense?.childrenDimension}
      isFetching={isFetching || isParentFetching}
      isLoading={isLoading}
      className={className}
    />
  );
};
