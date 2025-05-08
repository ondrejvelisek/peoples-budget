import { type FC } from "react";
import { ExplorerItem } from "../Explorer/ExplorerItem";
import type { LinkProps } from "@tanstack/react-router";
import type { IncomeKey } from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";

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
  const { data: income, isPending } = useIncome(incomeKey);
  const { data: parentIncome, isPending: isParentPending } = useIncome(
    income?.parent
  );
  const { data: rootIncome, isPending: isRootPending } = useIncome([]);
  const isAnyLoading = isPending || isParentPending || isRootPending;
  const isRoot = incomeKey?.length === 0;

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
    <ExplorerItem
      className={className}
      id={incomeKey.map((key) => `${key.dimension}-${key.id}`).join("-")}
      title={income?.title}
      amount={income?.amount}
      parentAmount={parentIncome?.amount}
      rootAmount={rootIncome?.amount}
      contributionAmount={(parentIncome?.amount ?? 0) / 1000000000} // TBD
      relation={relation}
      isLoading={isAnyLoading}
      hideMeter={isRoot || relation === "parent"}
      dimensionLinks={dimensionLinks}
      currentDimension={income?.childrenDimension}
      to="/2024/prijmy/$"
      params={{
        _splat: {
          incomeKey,
          incomeDimension: income?.childrenDimension,
        },
      }}
    />
  );
};
