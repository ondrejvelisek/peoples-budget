import { type FC } from "react";
import { useExpense } from "@/data/expenses/expenses";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import type { LinkProps } from "@tanstack/react-router";

type ExpenseItemProps = {
  itemKey: ExpenseKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  itemKey: expenseKey,
  relation = "parent",
  isLoading = false,
}) => {
  const { data: expense, isPending } = useExpense(expenseKey);
  const { data: parentExpense, isPending: isParentPending } = useExpense(
    expense?.parent
  );
  const { data: rootExpense, isPending: isRootPending } = useExpense([]);
  const isAnyLoading =
    isPending || isParentPending || isRootPending || isLoading;
  const isRoot = expenseKey?.length === 0;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/2024/vydaje/$",
      params: {
        _splat: {
          expenseKey: expenseKey,
          expenseDimension: "odvetvi",
        },
      },
    },
    {
      to: "/2024/vydaje/$",
      params: {
        _splat: {
          expenseKey: expenseKey,
          expenseDimension: "druh",
        },
      },
    },
    {
      to: "/2024/vydaje/$",
      params: {
        _splat: {
          expenseKey: expenseKey,
          expenseDimension: "urad",
        },
      },
    },
  ];

  return (
    <ExplorerItem
      id={expenseKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={expense?.title}
      amount={expense?.amount}
      parentAmount={parentExpense?.amount}
      rootAmount={rootExpense?.amount}
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      dimensionLinks={dimensionLinks}
      currentDimension={expense?.childrenDimension}
      to="/2024/vydaje/$"
      params={{
        _splat: {
          expenseKey,
          expenseDimension: expense?.childrenDimension,
        },
      }}
    />
  );
};
