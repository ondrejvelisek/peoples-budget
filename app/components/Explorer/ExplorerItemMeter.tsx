import { type FC } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION_DURATION_CLASS } from "./Explorer";

type ExplorerItemMeterProps = {
  amount?: number;
  parentAmount?: number;
  rootAmount?: number;
  className?: string;
  relation: "parent" | "subject" | "child";
  isLoading?: boolean;
};

export const ExplorerItemMeter: FC<ExplorerItemMeterProps> = ({
  amount,
  parentAmount,
  rootAmount,
  className,
  relation = "subject",
  isLoading = false,
}) => {
  if (isLoading || amount === undefined) {
    return null;
  }

  const localPercentage = parentAmount ? amount / parentAmount : 0;
  const globalPercentage = rootAmount ? amount / rootAmount : 0;

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 h-1 rounded transition-all opacity-1",
        ANIMATION_DURATION_CLASS,
        {
          "h-0 opacity-0": relation === "parent",
          "bg-neutral-200/80 mx-2": relation === "subject",
        },
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-20 h-full rounded bg-sky-200 transition-all",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${localPercentage * 100}%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 z-30 h-full rounded bg-sky-400 transition-all",
          ANIMATION_DURATION_CLASS
        )}
        style={{
          width: `max(0.25rem, ${globalPercentage * 100}%)`,
        }}
      />
    </div>
  );
};
