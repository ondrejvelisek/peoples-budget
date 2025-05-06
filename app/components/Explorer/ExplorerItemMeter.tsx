import { type FC } from "react";
import { cn } from "@/lib/utils";

type ExplorerItemMeterProps = {
  id: string;
  amount?: number;
  parentAmount?: number;
  rootAmount?: number;
  className?: string;
  isHidden: boolean;
  showBg: boolean;
};

export const ExplorerItemMeter: FC<ExplorerItemMeterProps> = ({
  id,
  amount,
  parentAmount,
  rootAmount,
  className,
  isHidden,
  showBg,
}) => {
  if (amount === undefined) {
    return null;
  }

  const localPercentage = parentAmount ? amount / parentAmount : 0;
  const globalPercentage = rootAmount ? amount / rootAmount : 0;

  return (
    <div
      style={{
        viewTransitionName: `meter-${id}`,
      }}
      className={cn(
        "absolute inset-0 z-10 h-1 rounded opacity-100",
        {
          "h-0 opacity-0": isHidden,
          "bg-neutral-200/80 mx-2": showBg,
        },
        className
      )}
    >
      <div
        className={cn("absolute inset-0 z-20 h-full rounded bg-sky-200")}
        style={{
          width: `max(0.25rem, ${localPercentage * 100}%)`,
        }}
      />
      <div
        className={cn("absolute inset-0 z-30 h-full rounded bg-sky-400")}
        style={{
          width: `max(0.25rem, ${globalPercentage * 100}%)`,
        }}
      />
    </div>
  );
};
