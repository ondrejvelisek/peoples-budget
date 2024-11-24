import { type FC } from "react";
import { ExpenseItem } from "../ExpensesExplorer/ExpenseItem";
import { useExpense, type ExpenseKey } from "@/data/expenses";
import { useParams } from "@tanstack/react-router";
import { Explorer } from "../Explorer/Explorer";

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
  const urlExpenseKey = useParams({ strict: false })._splat?.expenseKey;
  const {
    data: expense,
    isPending,
    isFetching,
  } = useExpense(itemKey);

  const isLoading = isPending;

  if (!urlExpenseKey) {
    return null;
  }

  return (
    <Explorer<ExpenseKey[number]>
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
