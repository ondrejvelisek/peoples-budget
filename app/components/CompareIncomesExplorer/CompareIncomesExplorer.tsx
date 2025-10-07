import { type FC } from "react";
import { Explorer } from "../Explorer/Explorer";
import type { LinkProps } from "@tanstack/react-router";
import { CompareIncomeItem } from "./CompareIncomeItem";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import {
  useUrlIncomeSplat,
  type IncomeKey,
} from "@/data/incomes/incomeDimensions";
import { useCompareIncome } from "@/data/compare/compareIncome";

type CompareIncomesExplorerProps = {
  className?: string;
};

export const CompareIncomesExplorer: FC<CompareIncomesExplorerProps> = ({
  className,
}) => {
  const { incomeKey } = useUrlIncomeSplat();
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const { data: income, isPending } = useCompareIncome(incomeKey);

  // better to use parentKey from urlExpenseKey for performance
  const parentKey = incomeKey.length > 0 ? incomeKey.slice(0, -1) : undefined;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/compare/$budgetName/$secondBudgetName/prijmy/$",
      params: {
        budgetName,
        secondBudgetName,
        _splat: {
          incomeKey,
          incomeDimension: "druh",
        },
      },
    },
    {
      to: "/compare/$budgetName/$secondBudgetName/prijmy/$",
      params: {
        budgetName,
        secondBudgetName,
        _splat: {
          incomeKey,
          incomeDimension: "urad",
        },
      },
    },
  ];

  return (
    <Explorer<IncomeKey>
      ExplorerItemComponent={CompareIncomeItem}
      subjectKey={incomeKey}
      parentKey={parentKey}
      childrenKeys={income?.children}
      dimensionLinks={dimensionLinks}
      currentDimension={income?.childrenDimension}
      isLoading={isPending}
      className={className}
    />
  );
};
