import { type FC } from "react";
import { cn, formatCurrency, formatCurrencyStandard } from "@/lib/utils";
import { Link, type LinkProps } from "@tanstack/react-router";
import { RiArrowLeftLine } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import { LuWallet } from "react-icons/lu";

import { Button } from "../ui/button";

type ItemProps = LinkProps & {
  id: string;
  relation: "parent" | "subject" | "child";
  isLoading?: boolean;
  title?: string;
  amount?: number;
  parentAmount?: number;
  rootAmount?: number;
  contributionAmount?: number;
  hideMeter?: boolean;
  className?: string;
};

export const ExplorerItem: FC<ItemProps> = ({
  id,
  relation = "parent",
  isLoading = false,
  title,
  amount,
  parentAmount,
  rootAmount,
  contributionAmount,
  hideMeter = false,
  className,
  ...linkProps
}) => {
  return (
    <Link
      viewTransition
      {...linkProps}
      className={cn(
        "relative flex flex-col overflow-hidden @container",
        {
          "rounded-lg border border-b-2 border-neutral-600/10 border-b-neutral-600/20 border-t-neutral-600/5":
            relation === "child",
        },
        className
      )}
      style={{
        viewTransitionName: `item-${id}`,
        viewTransitionClass: `item  ${relation}`,
      }}
    >
      {!hideMeter && (
        <Meter
          id={id}
          amount={amount}
          parentAmount={parentAmount}
          rootAmount={rootAmount}
          relation={relation}
          isLoading={isLoading}
          className={cn({
            "mx-3": relation === "subject",
          })}
        />
      )}

      <div
        className={cn("flex gap-2 p-3 pt-2", {
          "pb-2": relation === "parent",
        })}
      >
        {/* Buttons */}
        <Buttons id={id} relation={relation} />

        <div className="flex grow flex-col gap-1 overflow-hidden">
          <div className="flex items-baseline justify-between gap-1">
            <Title
              className="shrink grow"
              id={id}
              relation={relation}
              isLoading={isLoading}
              title={title}
            />
            {relation !== "parent" && (
              <Amount
                className="shrink-0"
                id={id}
                relation={relation}
                isLoading={isLoading}
                amount={amount}
              />
            )}
          </div>
          {relation !== "parent" && contributionAmount !== undefined && (
            <div className="flex items-baseline justify-between gap-1">
              <Contribution
                id={id}
                relation={relation}
                isLoading={isLoading}
                contributionAmount={contributionAmount}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const Title: FC<ItemProps> = ({
  id,
  relation = "parent",
  isLoading = false,
  title,
  className,
}) => {
  return (
    <div
      className={cn(
        "truncate pb-0.5 text-xs",
        {
          "text-2xs font-normal text-neutral-400": relation === "parent",
          "text-xl font-light -mt-0.5": relation === "subject",
          "text-sm font-normal": relation === "child",
        },
        "leading-none",
        className
      )}
    >
      {relation === "parent" && (
        <RiArrowLeftLine
          className="mb-0.5 mr-0.5  inline-block"
          style={{
            viewTransitionName: `title-arrow-${id}`,
            viewTransitionClass: `title-arrow  ${relation}`,
          }}
        />
      )}
      <span
        style={{
          viewTransitionName: `title-${id}`,
          viewTransitionClass: `title  ${relation}`,
        }}
      >
        {isLoading ? <Skeleton width="10em" /> : title}
      </span>
    </div>
  );
};

const Amount: FC<ItemProps> = ({
  id,
  relation = "parent",
  isLoading = false,
  amount,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-fit truncate text-base font-bold",
        { "text-lg leading-tight": relation === "subject" },
        className
      )}
      style={{
        viewTransitionName: `amount-${id}`,
        viewTransitionClass: `amount ${relation}`,
      }}
    >
      {isLoading ? (
        <Skeleton width="4em" />
      ) : amount !== undefined ? (
        formatCurrency(amount)
      ) : null}
    </div>
  );
};

const Contribution: FC<ItemProps> = ({
  id,
  relation = "parent",
  isLoading = false,
  contributionAmount,
  className,
}) => {
  return (
    <>
      <div
        className="text-2xs text-stone-400"
        style={{
          viewTransitionName: `contribution-title-${id}`,
          viewTransitionClass: `contribution-title  ${relation}`,
        }}
      >
        {isLoading ? (
          <Skeleton width="10em" />
        ) : contributionAmount !== undefined ? (
          <>
            <LuWallet className="inline-block" /> Měsíčně za toto státu
            zaplatíte
          </>
        ) : null}
      </div>
      <div
        className={cn("w-fit text-2xs font-bold", className)}
        style={{
          viewTransitionName: `contribution-${id}`,
          viewTransitionClass: `contribution  ${relation}`,
        }}
      >
        {isLoading ? (
          <Skeleton width="4em" />
        ) : contributionAmount !== undefined ? (
          `${formatCurrencyStandard(contributionAmount)} Kč`
        ) : null}
      </div>
    </>
  );
};

const Buttons: FC<ItemProps> = () => {
  // TODO: Design buttons
  return null;
  return (
    <div className="flex flex-col">
      <Button variant="outline" size="sm">
        +
      </Button>
      <Button variant="outline" size="sm">
        -
      </Button>
    </div>
  );
};

const Meter: FC<ItemProps> = ({
  amount,
  parentAmount,
  rootAmount,
  className,
  relation,
  isLoading,
}) => {
  if (amount === undefined) {
    return null;
  }

  const localPercentage = parentAmount ? amount / parentAmount : 0;
  const globalPercentage = rootAmount ? amount / rootAmount : 0;

  return (
    <div
      className={cn(
        "relative h-1 rounded opacity-100",
        {
          "bg-neutral-200/80": relation === "subject" || isLoading,
        },
        className
      )}
    >
      {!isLoading && (
        <>
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
        </>
      )}
    </div>
  );
};
