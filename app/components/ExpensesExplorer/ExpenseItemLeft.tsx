import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { RiArrowLeftLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { Link } from "@tanstack/react-router";
import { useExpense } from "@/data/expenses/expenses";
import { ANIMATION_DURATION_CLASS } from "../Explorer/Explorer";
import type { ExpenseKey } from "@/data/expenses/expenseDimensions";

type ExpenseItemLeftProps = {
  expenseKey?: ExpenseKey;
  title?: string;
  amount?: number;
  className?: string;
  relation: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const ExpenseItemLeft: FC<ExpenseItemLeftProps> = ({
  expenseKey,
  title,
  amount,
  className,
  relation = "subject",
  isLoading = false,
}) => {
  const { data: expense, isPending } = useExpense(expenseKey);
  return (
    <Link
      to="/2024/vydaje/$"
      params={{
        _splat: {
          expenseKey: expenseKey ?? [],
          expenseDimension: expense?.childrenDimension ?? "odvetvi",
        },
      }}
      disabled={
        relation === "subject" ||
        isLoading ||
        isPending ||
        !expense ||
        !expenseKey
      }
      className={cn("grow overflow-hidden", className)}
    >
      <div
        className={cn(
          "flex items-center truncate transition-all",
          ANIMATION_DURATION_CLASS,
          {
            "text-2xs font-normal text-neutral-400 leading-4":
              relation === "parent",
            "text-xl font-light": relation === "subject",
            "text-xs font-normal": relation === "child",
          }
        )}
      >
        <span
          className={cn(
            "max-w-[1em] overflow-hidden text-neutral-400 transition-all",
            ANIMATION_DURATION_CLASS,
            {
              "max-w-0 opacity-0": relation !== "parent",
            }
          )}
        >
          <RiArrowLeftLine className="pr-0.5" />
        </span>
        {isLoading ? <Skeleton width="8em" /> : <span>{title}</span>}
      </div>
      <div
        className={cn(
          "max-h-[1.3em] truncate font-bold transition-all",
          ANIMATION_DURATION_CLASS,
          {
            "max-h-0 opacity-0": relation === "parent",
          }
        )}
      >
        {isLoading ? (
          <Skeleton width="4em" />
        ) : amount !== undefined ? (
          formatCurrency(amount)
        ) : null}
      </div>
    </Link>
  );
};
