import { type FC } from "react";
import { ExpenseItem } from "../ExpensesExplorer/ExpenseItem";
import { useExpense } from "@/data/expenses/expenses";
import { Explorer } from "../Explorer/Explorer";
import {
  useUrlExpenseSplat,
  type ExpenseKey,
} from "@/data/expenses/expenseDimensions";
import type { LinkProps } from "@tanstack/react-router";
import { useBudgetName } from "@/lib/budget";
type ExpensesExplorerProps = {
  className?: string;
};

export const ExpensesExplorer: FC<ExpensesExplorerProps> = ({ className }) => {
  const { expenseKey } = useUrlExpenseSplat();
  const budgetName = useBudgetName();
  const { data: expense, isPending } = useExpense(expenseKey);

  // better to use parentKey from urlExpenseKey for performance
  const parentKey = expenseKey.length > 0 ? expenseKey.slice(0, -1) : undefined;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/vladni/$budgetName/vydaje/$",
      params: {
        budgetName,
        _splat: {
          expenseKey,
          expenseDimension: "odvetvi",
        },
      },
    },
    {
      to: "/vladni/$budgetName/vydaje/$",
      params: {
        budgetName,
        _splat: {
          expenseKey,
          expenseDimension: "druh",
        },
      },
    },
    {
      to: "/vladni/$budgetName/vydaje/$",
      params: {
        budgetName,
        _splat: {
          expenseKey,
          expenseDimension: "urad",
        },
      },
    },
  ];

  return (
    <Explorer<ExpenseKey>
      ExplorerItemComponent={ExpenseItem}
      subjectKey={expenseKey}
      parentKey={parentKey}
      childrenKeys={expense?.children}
      dimensionLinks={dimensionLinks}
      currentDimension={expense?.childrenDimension}
      isLoading={isPending}
      className={className}
    />
  );
};
