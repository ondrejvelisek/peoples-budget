import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION_DURATION_CLASS } from "../Explorer/Explorer";
import type { IncomeKey } from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";

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
}) => {
  const { data: income } = useIncome(incomeKey);

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
    </div>
  );
};
