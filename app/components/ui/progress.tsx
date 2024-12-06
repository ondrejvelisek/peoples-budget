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
  return (
    <div
      ref={ref}
      className={cn("absolute size-full group", className)}
      {...restProps}
    >
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "w-full absolute -inset-y-2 hover:scale-y-[2] transition-transform"
          )}
        >
          <ProgressPrimitive.Indicator className={cn("size-full py-2")}>
            <div
              className={cn(
                "size-full bg-current group-first:rounded-l-full group-last:rounded-r-full"
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
  let totalValue = indicatorsProps.reduce((acc, { value }) => acc + value, 0);
  let prevTotalValue = 0;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative w-full", className)}
      {...props}
    >
      {indicatorsProps.map(
        ({ value, description, className, ...restProps }, index) => {
          prevTotalValue += value;
          return (
            <ProgressIndicator
              key={index}
              className={cn("origin-left", className)}
              tooltipTitle={description}
              tooltipValue={value}
              style={{
                transform: `translateX(${((prevTotalValue - value) / totalValue) * 100}%) scaleX(${(value / totalValue) * 100}%)`,
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
