import { type FC } from "react";
import { Explorer } from "../Explorer/Explorer";
import { IncomeItem } from "./IncomeItem";
import {
  useUrlIncomeSplat,
  type IncomeKey,
} from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";
import type { LinkProps } from "@tanstack/react-router";

type IncomesExplorerProps = {
  className?: string;
};

export const IncomesExplorer: FC<IncomesExplorerProps> = ({ className }) => {
  const { incomeKey } = useUrlIncomeSplat();
  const { data: income, isPending } = useIncome(incomeKey);

  // better to use parentKey from incomeKey for performance
  const parentKey = incomeKey.length > 0 ? incomeKey.slice(0, -1) : undefined;

  const dimensionLinks: Array<LinkProps> = [
    {
      to: "/2024/prijmy/$",
      params: {
        _splat: {
          incomeKey,
          incomeDimension: "druh",
        },
      },
    },
    {
      to: "/2024/prijmy/$",
      params: {
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
