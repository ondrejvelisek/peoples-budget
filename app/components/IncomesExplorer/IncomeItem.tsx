import { type FC } from "react";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import type { IncomeKey } from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";
import { useBudgetName } from "@/lib/budget";
type IncomeItemProps = {
  itemKey: IncomeKey;
  className?: string;
  relation?: "parent" | "subject" | "child";
};

export const IncomeItem: FC<IncomeItemProps> = ({
  itemKey: incomeKey,
  relation = "parent",
  className,
}) => {
  const budgetName = useBudgetName();
  const { data: income, isPending } = useIncome(incomeKey);
  const { data: parentIncome, isPending: isParentPending } = useIncome(
    income?.parent
  );
  const { data: rootIncome, isPending: isRootPending } = useIncome([]);
  const isAnyLoading = isPending || isParentPending || isRootPending;
  const isRoot = incomeKey?.length === 0;

  return (
    <ExplorerItem
      className={className}
      id={incomeKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={income?.title}
      amount={income?.amount}
      parentAmount={parentIncome?.amount}
      rootAmount={rootIncome?.amount}
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      to="/vladni/$budgetName/prijmy/$"
      params={{
        budgetName,
        _splat: {
          incomeKey,
          incomeDimension: income?.childrenDimension,
        },
      }}
    />
  );
};
