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
  className?: string;
};

export const IncomesExplorer: FC<IncomesExplorerProps> = ({
  itemKey = [],
  className,
}) => {
  const { data: income } = useIncome(itemKey);

  const { incomeKey: urlIncomeKey } = useUrlIncomeSplat();

  // better to use parentKey from urlIncomeKey for performance
  const parentKey =
    urlIncomeKey.length > 0 ? urlIncomeKey.slice(0, -1) : undefined;

  return (
    <Explorer<IncomeKey>
      ExplorerItemComponent={IncomeItem}
      subjectKey={urlIncomeKey}
      parentKey={parentKey}
      childrenKeys={income?.children}
      className={className}
    />
  );
};
