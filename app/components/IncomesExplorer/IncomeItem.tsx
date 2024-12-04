import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION_DURATION_CLASS } from "../Explorer/Explorer";
import { ExplorerItemMeter } from "../Explorer/ExplorerItemMeter";
import { useIncome } from "@/data/incomes/incomes";
import type { IncomeKey } from "@/data/incomes/incomeDimensions";

type IncomeItemProps = {
  itemKey?: IncomeKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const IncomeItem: FC<IncomeItemProps> = ({
  itemKey: incomeKey,
  className,
  relation = "parent",
  isLoading = false,
}) => {
  const { data: income, isPending } = useIncome(incomeKey);
  const { data: parentIncome, isPending: isParentPending } = useIncome(
    income?.parent
  );
  const { data: rootExpense, isPending: isRootPending } = useIncome([]);
  const isAnyLoading =
    isPending || isParentPending || isRootPending || isLoading;
  const isRoot = incomeKey?.length === 0;

  return (
    <div
      className={cn(
        "relative block h-auto w-full bg-white transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "px-2 pt-1": relation === "parent",
          "pt-2 px-2 pb-5 active:bg-transparent hover:bg-transparent":
            relation === "subject",
          "px-2 pt-2 pb-2": relation === "child",
        },
        className
      )}
    >
      <div className="flex grow justify-between gap-4">{income?.title}</div>

      <ExplorerItemMeter
        amount={income?.amount}
        parentAmount={parentIncome?.amount}
        rootAmount={rootExpense?.amount}
        className={cn("absolute inset-0")}
        relation={isRoot ? "parent" : relation}
        isLoading={isAnyLoading}
      />
    </div>
  );
};
