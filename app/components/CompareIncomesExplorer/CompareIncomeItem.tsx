import { type FC } from "react";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import type { IncomeKey } from "@/data/incomes/incomeDimensions";
import { useCompareIncome } from "@/data/compare/compareIncome";

type CompareIncomeItemProps = {
  itemKey: IncomeKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const CompareIncomeItem: FC<CompareIncomeItemProps> = ({
  itemKey: incomeKey,
  relation = "parent",
  className,
}) => {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const { data: compareIncome, isPending } = useCompareIncome(incomeKey);
  const { data: parentCompareIncome, isPending: isParentPending } =
    useCompareIncome(compareIncome?.parent);
  const isAnyLoading = isPending || isParentPending;
  const isRoot = incomeKey?.length === 0;

  return (
    <ExplorerItem
      compareMode
      className={className}
      id={incomeKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={compareIncome?.title}
      amount={compareIncome?.amount}
      parentAmount={parentCompareIncome?.maxChildrenAmount}
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      to="/compare/$budgetName/$secondBudgetName/prijmy/$"
      params={{
        budgetName,
        secondBudgetName,
        _splat: {
          incomeKey,
          incomeDimension: compareIncome?.childrenDimension,
        },
      }}
    />
  );
};
