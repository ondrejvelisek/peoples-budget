import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { RiArrowLeftLine } from "react-icons/ri";
import { ANIMATION_DURATION_CLASS } from "./ExpensesExplorer";

type ExpenseItemLeftProps = {
  title: string;
  amount: number;
  className?: string;
  relation: "parent" | "subject" | "child";
};

export const ExpenseItemLeft: FC<ExpenseItemLeftProps> = ({
  title,
  amount,
  className,
  relation = "subject",
}) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex items-center truncate transition-all",
          ANIMATION_DURATION_CLASS,
          {
            "text-2xs font-normal text-neutral-400": relation === "parent",
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
        <span>{title}</span>
      </div>
      {/*<div
        className={cn(
          "h-[1.3em] truncate font-bold transition-all",
          ANIMATION_DURATION_CLASS,
          {
            "h-0 opacity-0": relation !== "child",
          }
        )}
      >
        {formatCurrency(amount)}
      </div>*/}
    </div>
  );
};
