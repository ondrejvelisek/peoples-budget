import { type FC } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ExplorerItemMeter } from "./ExplorerItemMeter";
import { ANIMATION_DURATION_CLASS } from "./Explorer";
import { Link, type LinkProps } from "@tanstack/react-router";
import { RiArrowLeftLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { DimensionSwitcher } from "./DimensionSwitcher";
import type { Dimension } from "@/data/dimensions";

type ItemProps = LinkProps & {
  title?: string;
  amount?: number;
  parentAmount?: number;
  rootAmount?: number;
  className?: string;
  relation?: "parent" | "subject" | "child";
  isLoading?: boolean;
  hideMeter?: boolean;
  dimensionLinks: Array<LinkProps>;
  currentDimension?: Dimension;
};

export const ExplorerItem: FC<ItemProps> = ({
  title,
  amount,
  parentAmount,
  rootAmount,
  className,
  relation = "parent",
  isLoading = false,
  hideMeter = false,
  dimensionLinks,
  currentDimension,
  ...linkProps
}) => {
  return (
    <div
      className={cn(
        "relative block h-auto w-full bg-white transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "px-2 pt-1": relation === "parent",
          "pt-2 px-2 pb-5 active:bg-transparent hover:bg-transparent":
            relation === "subject",
          "px-2 pt-2 pb-2": relation === "child",
        },
        className
      )}
    >
      <div className="flex grow justify-between gap-4">
        <Link
          {...linkProps}
          disabled={relation === "subject" || isLoading}
          className={cn("grow overflow-hidden")}
        >
          <div
            className={cn(
              "flex items-center truncate transition-all",
              ANIMATION_DURATION_CLASS,
              {
                "text-2xs font-normal text-neutral-400 leading-4":
                  relation === "parent",
                "text-xl font-light": relation === "subject",
                "text-xs font-normal": relation === "child",
              }
            )}
          >
            <span
              className={cn(
                "max-w-[1em] overflow-hidden text-neutral-400 transition-all",
                ANIMATION_DURATION_CLASS,
                {
                  "max-w-0 opacity-0": relation !== "parent",
                }
              )}
            >
              <RiArrowLeftLine className="pr-0.5" />
            </span>
            {isLoading ? <Skeleton width="8em" /> : <span>{title}</span>}
          </div>
          <div
            className={cn(
              "max-h-[1.3em] truncate font-bold transition-all",
              ANIMATION_DURATION_CLASS,
              {
                "max-h-0 opacity-0": relation === "parent",
              }
            )}
          >
            {isLoading ? (
              <Skeleton width="4em" />
            ) : amount !== undefined ? (
              formatCurrency(amount)
            ) : null}
          </div>
        </Link>

        <div
          className={cn(
            "max-w-[50%] max-h-12 overflow-hidden text-right opacity-100 transition-all shrink-0",
            ANIMATION_DURATION_CLASS,
            {
              "max-w-0 max-h-0 opacity-0 grow-0": relation !== "subject",
            }
          )}
        >
          <DimensionSwitcher
            dimensionLinks={dimensionLinks}
            currentDimension={currentDimension}
          />
        </div>
      </div>

      <ExplorerItemMeter
        amount={amount}
        parentAmount={parentAmount}
        rootAmount={rootAmount}
        className={cn("absolute inset-0")}
        isHidden={hideMeter || isLoading}
        showBg={relation === "subject"}
      />
    </div>
  );
};
