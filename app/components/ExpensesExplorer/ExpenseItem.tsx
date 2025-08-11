import { type FC } from "react";
import { useExpense } from "@/data/expenses/expenses";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import { usePersonalIncome } from "@/data/personalIncome/personalIncomeHook";
import { useBudgetName } from "@/lib/budget";

type ExpenseItemProps = {
  itemKey: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  itemKey: expenseKey,
  relation = "parent",
  className,
}) => {
  const budgetName = useBudgetName();
  const { data: expense, isPending } = useExpense(expenseKey);
  const { data: parentExpense, isPending: isParentPending } = useExpense(
    expense?.parent
  );
  const { data: rootExpense, isPending: isRootPending } = useExpense([]);
  const { totalPersonalContributions, isPending: isPersonalIncomePending } =
    usePersonalIncome();
  const isAnyLoading =
    isPending || isParentPending || isRootPending || isPersonalIncomePending;
  const isRoot = expenseKey?.length === 0;
  const contributionAmount =
    expense && rootExpense && totalPersonalContributions
      ? (expense.amount / rootExpense.amount) * totalPersonalContributions
      : undefined;

  return (
    <ExplorerItem
      className={className}
      id={expenseKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={expense?.title}
      amount={expense?.amount}
      parentAmount={parentExpense?.amount}
      rootAmount={rootExpense?.amount}
      contributionAmount={isAnyLoading ? 0 : contributionAmount}
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      to="/vladni/$budgetName/vydaje/$"
      params={{
        budgetName,
        _splat: {
          expenseKey,
          expenseDimension: expense?.childrenDimension,
        },
      }}
    />
  );
};
