import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn, formatCurrency } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const ProgressIndicator = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator> & {
    tooltipTitle?: string;
    tooltipValue?: number;
  }
>(({ className, tooltipTitle, tooltipValue, ...restProps }, ref) => {
  if (tooltipValue === undefined || tooltipTitle === undefined) {
    return (
      <div
        ref={ref}
        className={cn("absolute size-full group", className)}
        {...restProps}
      >
        <div className={cn("w-full absolute -inset-y-2")}>
          <ProgressPrimitive.Indicator className={cn("size-full py-2")}>
            <div
              className={cn(
                "size-full bg-current group-first:rounded-l-full group-last:rounded-r-full"
              )}
            />
          </ProgressPrimitive.Indicator>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={cn("absolute size-full group", className)}
      {...restProps}
    >
      <Tooltip delayDuration={400}>
        <TooltipTrigger className={cn("w-full absolute -inset-y-2")}>
          <ProgressPrimitive.Indicator className={cn("size-full py-2")}>
            <div
              className={cn(
                "size-full bg-current group-first:rounded-l-full group-last:rounded-r-full group-hover:shadow-[0_0_3px_0px_currentColor]"
              )}
            />
          </ProgressPrimitive.Indicator>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>{tooltipTitle}</div>
          <div>{formatCurrency(tooltipValue)}</div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
});
ProgressIndicator.displayName = "ProgressIndicator";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    "value"
  > & {
    indicatorsProps: Array<
      React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator> & {
        value: number;
        description?: string;
      }
    >;
  }
>(({ className, indicatorsProps, ...props }, ref) => {
  const totalValue = indicatorsProps.reduce((acc, { value }) => acc + value, 0);
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative w-full", className)}
      {...props}
    >
      {indicatorsProps.map(
        ({ value, description, className, ...restProps }, index) => {
          const prevTotalValue = indicatorsProps
            .slice(0, index)
            .reduce((acc, { value }) => acc + value, 0);
          return (
            <ProgressIndicator
              key={index}
              className={cn(className)}
              tooltipTitle={description}
              tooltipValue={value}
              style={{
                left: `${(prevTotalValue / totalValue) * 100}%`,
                width: `${(value / totalValue) * 100}%`,
              }}
              {...restProps}
            />
          );
        }
      )}
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
