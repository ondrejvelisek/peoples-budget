import { type FC } from "react";
import { Explorer } from "../Explorer/Explorer";
import { IncomeItem } from "./IncomeItem";
import {
  useUrlIncomeSplat,
  type IncomeKey,
} from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";
import type { LinkProps } from "@tanstack/react-router";
import { useBudgetName } from "@/pages/~vladni/~$budgetName";
type IncomesExplorerProps = {
  className?: string;
};

export const IncomesExplorer: FC<IncomesExplorerProps> = ({ className }) => {
  const { incomeKey } = useUrlIncomeSplat();
  const { data: income, isPending } = useIncome(incomeKey);
  const budgetName = useBudgetName();

  // better to use parentKey from incomeKey for performance
  const parentKey = incomeKey.length > 0 ? incomeKey.slice(0, -1) : undefined;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/vladni/$budgetName/prijmy/$",
      params: {
        budgetName,
        _splat: {
          incomeKey,
          incomeDimension: "druh",
        },
      },
    },
    {
      to: "/vladni/$budgetName/prijmy/$",
      params: {
        budgetName,
        _splat: {
          incomeKey,
          incomeDimension: "urad",
        },
      },
    },
  ];

  return (
    <Explorer<IncomeKey>
      ExplorerItemComponent={IncomeItem}
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
