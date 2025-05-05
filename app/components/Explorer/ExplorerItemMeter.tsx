import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION_DURATION_CLASS } from "./Explorer";

type ExplorerItemMeterProps = {
  amount?: number;
  parentAmount?: number;
  rootAmount?: number;
  className?: string;
  isHidden: boolean;
  showBg: boolean;
};

export const ExplorerItemMeter: FC<ExplorerItemMeterProps> = ({
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
      className={cn(
        "absolute inset-0 z-10 h-1 rounded opacity-100",
        ANIMATION_DURATION_CLASS,
        {
          "h-0 opacity-0": isHidden,
          "bg-neutral-200/80 mx-2": showBg,
        },
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-20 h-full rounded bg-sky-200",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${localPercentage * 100}%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 z-30 h-full rounded bg-sky-400",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${globalPercentage * 100}%)`,
        }}
      />
    </div>
  );
};
