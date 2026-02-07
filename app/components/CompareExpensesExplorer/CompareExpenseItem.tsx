import { type FC } from "react";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { useCompareExpense } from "@/data/compare/compareExpense";
import { usePersonalIncome } from "@/data/personalIncome/personalIncomeHook";
import { useBudgetMetadata } from "@/data/metadata/metadataHooks";

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
  const { data: budgetMetadata } = useBudgetMetadata(budgetName);
  const secondBudgetName = useSecondBudgetName();
  const { data: secondBudgetMetadata } = useBudgetMetadata(secondBudgetName);
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

  const relativeChange =
    compareExpense?.primaryAmount && compareExpense?.secondaryAmount
      ? (compareExpense.primaryAmount - compareExpense.secondaryAmount) /
        compareExpense.primaryAmount
      : undefined;
  const relativeChangePercentage = relativeChange
    ? relativeChange * 100
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
      additionalAmounts={[
        ["Změna v %", relativeChangePercentage, "%"],
        [budgetMetadata?.title ?? "...", compareExpense?.primaryAmount, ""],
        [
          secondBudgetMetadata?.title ?? "...",
          compareExpense?.secondaryAmount,
          "",
        ],
      ]}
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
