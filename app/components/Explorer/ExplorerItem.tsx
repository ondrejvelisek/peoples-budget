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
  id: string;
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
  id,
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
        "relative block h-auto w-full bg-white",
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
          viewTransition
          disabled={relation === "subject" || isLoading}
          className={cn("grow overflow-hidden")}
        >
          <div
            className={cn(
              "flex items-center truncate",
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
                "max-w-[1em] overflow-hidden text-neutral-400",
                ANIMATION_DURATION_CLASS,
                {
                  "max-w-0 opacity-0": relation !== "parent",
                }
              )}
            >
              <RiArrowLeftLine className="pr-0.5" />
            </span>
            {isLoading ? (
              <Skeleton
                width="8em"
                style={{
                  viewTransitionName: `title-${id}`,
                }}
              />
            ) : (
              <span
                style={{
                  viewTransitionName: `title-${id}`,
                }}
              >
                {title}
              </span>
            )}
          </div>
          <div
            className={cn(
              "max-h-[1.3em] truncate font-bold",
              ANIMATION_DURATION_CLASS,
              {
                "max-h-0 opacity-0": relation === "parent",
              }
            )}
          >
            {isLoading ? (
              <Skeleton
                style={{
                  viewTransitionName: `amount-${id}`,
                }}
                width="4em"
              />
            ) : amount !== undefined ? (
              <span
                style={{
                  viewTransitionName: `amount-${id}`,
                }}
              >
                {formatCurrency(amount)}
              </span>
            ) : null}
          </div>
        </Link>

        {relation === "subject" && (
          <div
            style={{
              viewTransitionName: `dimension-switcher`,
            }}
            className={cn(
              "max-h-12 max-w-[50%] shrink-0 overflow-hidden text-right opacity-100"
            )}
          >
            <DimensionSwitcher
              dimensionLinks={dimensionLinks}
              currentDimension={currentDimension}
            />
          </div>
        )}
      </div>

      <ExplorerItemMeter
        id={id}
        amount={amount}
        parentAmount={parentAmount}
        rootAmount={rootAmount}
        className={cn({
          "rounded-t-full rounded-b-none overflow-hidden ml-0.5":
            relation === "child",
        })}
        isHidden={hideMeter || isLoading}
        showBg={relation === "subject"}
      />
    </div>
  );
};
