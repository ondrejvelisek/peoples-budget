import { type FC } from "react";
import { Explorer } from "../Explorer/Explorer";
import { IncomeItem } from "./IncomeItem";
import {
  useUrlIncomeSplat,
  type IncomeKey,
} from "@/data/incomes/incomeDimensions";
import { useIncome } from "@/data/incomes/incomes";

type IncomesExplorerProps = {
  itemKey?: IncomeKey;
  isParentFetching?: boolean;
  isFetching?: boolean;
  className?: string;
};

export const IncomesExplorer: FC<IncomesExplorerProps> = ({
  itemKey = [],
  isParentFetching = false,
  className,
}) => {
  const { data: income, isPending, isFetching } = useIncome(itemKey);

  const isLoading = isPending;

  const { incomeKey: urlIncomeKey } = useUrlIncomeSplat();

  return (
    <Explorer<IncomeKey>
      itemKey={itemKey}
      ExplorerComponent={IncomesExplorer}
      ExplorerItemComponent={IncomeItem}
      subjectKey={urlIncomeKey}
      childrenKeys={income?.children}
      childrenDimension={income?.childrenDimension}
      isFetching={isFetching || isParentFetching}
      isLoading={isLoading}
      className={className}
    />
  );
};
