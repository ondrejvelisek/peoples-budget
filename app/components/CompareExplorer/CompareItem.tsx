import { type FC } from "react";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { useCompareExpense } from "@/data/compare/compareExpense";

type CompareItemProps = {
  itemKey: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const CompareItem: FC<CompareItemProps> = ({
  itemKey: expenseKey,
  relation = "parent",
  className,
}) => {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const { data: compareExpense, isPending } = useCompareExpense(expenseKey);
  const { data: parentCompareExpense, isPending: isParentPending } =
    useCompareExpense(compareExpense?.parent);
  const isAnyLoading = isPending || isParentPending;
  const isRoot = expenseKey?.length === 0;

  return (
    <ExplorerItem
      compareMode
      className={className}
      id={expenseKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={compareExpense?.title}
      amount={compareExpense?.amount}
      parentAmount={parentCompareExpense?.maxChildrenAmount}
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      to="/compare/$budgetName/$secondBudgetName/vydaje/$"
      params={{
        budgetName,
        secondBudgetName,
        _splat: {
          expenseKey,
          expenseDimension: compareExpense?.childrenDimension,
        },
      }}
    />
  );
};
