import { type FC } from "react";
import { RingProgress } from "../ui/ring-progress";
import { Button } from "../ui/button";
import { RiArrowRightWideLine } from "react-icons/ri";
import { Link } from "@tanstack/react-router";
import { formatCurrency, formatPercent } from "@/lib/utils";

type ExpenseItemProps = {
  name: string;
  title: string;
  amount: number;
  percentage: number;
};

export const ExpenseItem: FC<ExpenseItemProps> = ({
  title,
  amount,
  percentage,
  name,
}) => {
  return (
    <Button
      variant="ghost"
      asChild
      className="h-auto w-full gap-3 rounded-xl p-2 pr-3"
    >
      <Link to="/2024/$expenseName" params={{ expenseName: name }}>
        <li className="flex w-full gap-3 overflow-hidden">
          <RingProgress
            value={percentage * 100}
            className="h-12"
            innerDimension={10}
            strokeWidth={1}
          >
            <p className="text-2xs text-amber-500">
              {formatPercent(percentage)}
            </p>
          </RingProgress>
          <div className="flex grow items-center justify-between overflow-hidden">
            <div className="shrink overflow-hidden">
              <div className="overflow-hidden text-ellipsis text-xs font-normal">
                {title}
              </div>
              <div className="font-bold">{formatCurrency(amount)}</div>
            </div>
            <RiArrowRightWideLine className="shrink-0 text-2xl text-neutral-200" />
            <div className="shrink overflow-hidden text-right">
              <div className="overflow-hidden text-ellipsis font-bold">
                {formatCurrency(amount)}
              </div>
              <div className="overflow-hidden text-ellipsis text-xs font-normal">
                {title}
              </div>
            </div>
          </div>
        </li>
      </Link>
    </Button>
  );
};
