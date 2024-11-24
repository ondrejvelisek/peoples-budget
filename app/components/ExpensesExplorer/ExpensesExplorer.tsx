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
    isFetching: isExpenseFetching,
  } = useExpense(itemKey);

  const isLoading = isPending || isParentFetching;

  if (!urlExpenseKey) {
    return null;
  }

  return (
    <Explorer<ExpenseKey[number]>
      itemKey={itemKey}
      ExplorerComponent={ExpensesExplorer}
      subjectKey={urlExpenseKey}
      childrenKeys={expense?.children}
      isFetching={isExpenseFetching}
      isLoading={isLoading}
      className={className}
    >
      {({ itemKey, relation, isLoading }) => (
        <ExpenseItem
          expenseKey={itemKey}
          relation={relation}
          isLoading={isLoading}
        />
      )}
    </Explorer>
  );
};
