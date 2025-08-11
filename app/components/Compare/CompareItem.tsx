import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  calculateRelativeChange,
  type CompareItem as CompareItemType,
} from "@/data/compare/compareFlat";

type ItemProps = {
  compareItem: CompareItemType;
  className?: string;
};

export const CompareItem: FC<ItemProps> = ({ compareItem, className }) => {
  const { sectorTitle, typeTitle, officeTitle, firstAmount, secondAmount } =
    compareItem;

  const isPositive = firstAmount - secondAmount > 0;
  const relativeChange =
    calculateRelativeChange(firstAmount, secondAmount) * 100;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-b-2 border-neutral-600/10 border-b-neutral-600/20 border-t-neutral-600/5 px-3 py-2",
        className
      )}
    >
      <div>
        {officeTitle && (
          <div className="truncate text-sm text-neutral-500">{officeTitle}</div>
        )}
        {sectorTitle && <div className="truncate">{sectorTitle}</div>}
        {typeTitle && (
          <div className="truncate  text-sm text-neutral-500">{typeTitle}</div>
        )}
      </div>
      <div className="flex gap-2">
        <div className="grow">
          <div className="font-bold">{formatCurrency(secondAmount)}</div>
          <div className="text-sm leading-none  text-neutral-500">2024</div>
        </div>
        <div className="border-l border-neutral-600/10" />
        <div
          className={cn(
            "grow font-bold",
            isPositive ? "text-green-600" : "text-rose-600"
          )}
        >
          <div>
            {isPositive ? "+" : ""}
            {formatCurrency(firstAmount - secondAmount)}
          </div>
          <div className="text-sm">
            {isPositive ? "+" : ""}
            {relativeChange === Infinity ? "ထ" : relativeChange.toFixed(2)} %
          </div>
        </div>
        <div className="border-l border-neutral-600/10" />
        <div className="grow">
          <div className="font-bold">{formatCurrency(firstAmount)}</div>
          <div className="text-sm leading-none  text-neutral-500">2025</div>
        </div>
      </div>
    </div>
  );
};
