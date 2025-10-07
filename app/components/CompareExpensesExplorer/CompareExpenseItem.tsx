import { type FC } from "react";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { useCompareExpense } from "@/data/compare/compareExpense";
import { usePersonalIncome } from "@/data/personalIncome/personalIncomeHook";

type CompareExpenseItemProps = {
  itemKey: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const CompareExpenseItem: FC<CompareExpenseItemProps> = ({
  itemKey: expenseKey,
  relation = "parent",
  className,
}) => {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const { data: compareExpense, isPending } = useCompareExpense(expenseKey);
  const { data: rootCompareExpense, isPending: isRootPending } =
    useCompareExpense([]);
  const { data: parentCompareExpense, isPending: isParentPending } =
    useCompareExpense(compareExpense?.parent);
  const { totalPersonalContributions, isPending: isPersonalIncomePending } =
    usePersonalIncome();
  const isAnyLoading =
    isPending || isParentPending || isRootPending || isPersonalIncomePending;
  const isRoot = expenseKey?.length === 0;

  const contributionChangeAmount =
    compareExpense && rootCompareExpense && totalPersonalContributions
      ? (compareExpense.amount / rootCompareExpense.primaryAmount) *
        totalPersonalContributions
      : undefined;

  return (
    <ExplorerItem
      compareMode
      className={className}
      id={expenseKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={compareExpense?.title}
      amount={compareExpense?.amount}
      parentAmount={parentCompareExpense?.maxChildrenAmount}
      contributionAmount={isAnyLoading ? 0 : contributionChangeAmount}
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
