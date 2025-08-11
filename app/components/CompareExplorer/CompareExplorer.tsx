import { type FC } from "react";
import { Explorer } from "../Explorer/Explorer";
import {
  useUrlExpenseSplat,
  type ExpenseKey,
} from "@/data/expenses/expenseDimensions";
import type { LinkProps } from "@tanstack/react-router";
import { CompareItem } from "./CompareItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { useCompareExpense } from "@/data/compare/compareExpense";

type CompareExplorerProps = {
  className?: string;
};

export const CompareExplorer: FC<CompareExplorerProps> = ({ className }) => {
  const { expenseKey } = useUrlExpenseSplat();
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const { data: expense, isPending } = useCompareExpense(expenseKey);

  // better to use parentKey from urlExpenseKey for performance
  const parentKey = expenseKey.length > 0 ? expenseKey.slice(0, -1) : undefined;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/compare/$budgetName/$secondBudgetName/vydaje/$",
      params: {
        budgetName,
        secondBudgetName,
        _splat: {
          expenseKey,
          expenseDimension: "odvetvi",
        },
      },
    },
    {
      to: "/compare/$budgetName/$secondBudgetName/vydaje/$",
      params: {
        budgetName,
        secondBudgetName,
        _splat: {
          expenseKey,
          expenseDimension: "druh",
        },
      },
    },
    {
      to: "/compare/$budgetName/$secondBudgetName/vydaje/$",
      params: {
        budgetName,
        secondBudgetName,
        _splat: {
          expenseKey,
          expenseDimension: "urad",
        },
      },
    },
  ];

  return (
    <>
      <h2 className="px-3 py-2 text-sm">
        Porovnání {budgetName} proti {secondBudgetName}
      </h2>
      <Explorer<ExpenseKey>
        ExplorerItemComponent={CompareItem}
        subjectKey={expenseKey}
        parentKey={parentKey}
        childrenKeys={expense?.children}
        dimensionLinks={dimensionLinks}
        currentDimension={expense?.childrenDimension}
        isLoading={isPending}
        className={className}
      />
    </>
  );
};
