import { type FC } from "react";
import { RingProgress } from "../ui/ring-progress";
import { Button } from "../ui/button";
import { RiArrowRightWideLine } from "react-icons/ri";

type ExpenseItemProps = {
  title: string;
  amount: number;
};

export const ExpenseItem: FC<ExpenseItemProps> = ({ title, amount }) => {
  return (
    <Button
      variant="ghost"
      asChild
      className="flex h-auto w-full gap-3 rounded-xl p-2 pr-3"
    >
      <li>
        <RingProgress
          value={66}
          className="h-12"
          innerDimension={10}
          strokeWidth={1}
        >
          <p className="text-2xs text-amber-500">33%</p>
        </RingProgress>
        <div className="flex grow items-center justify-between">
          <div className="">
            <div className="text-xs font-normal">{title}</div>
            <div className="font-bold">{amount}</div>
          </div>
          <RiArrowRightWideLine className="text-2xl text-neutral-200" />
          <div className="text-right">
            <div className="font-bold">{amount}</div>
            <div className="text-xs font-normal">{title}</div>
          </div>
        </div>
      </li>
    </Button>
  );
};
