import * as React from "react";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, SVGAttributes } from "react";

type RingProgressProps = HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren<{
    svgProps?: SVGAttributes<SVGSVGElement>;
    ringProps?: SVGAttributes<SVGCircleElement>;
    sectionProps?: SVGAttributes<SVGCircleElement>;
    value: number;
    strokeWidth?: number;
    innerDimension?: number;
  }>;

const RingProgress = React.forwardRef<HTMLDivElement, RingProgressProps>(
  (
    {
      className,
      value,
      svgProps,
      ringProps,
      innerDimension,
      sectionProps,
      strokeWidth,
      children,
      ...props
    },
    ref
  ) => {
    const { className: svgClassName, ...restSvgProps } = svgProps ?? {};
    const { className: ringClassName, ...restRingProps } = ringProps ?? {};
    const { className: sectionClassName, ...restSectionProps } =
      sectionProps ?? {};
    const finalStrokeWidth = strokeWidth ?? 8;
    const dimension = innerDimension ?? 100;
    return (
      <div
        className={cn("aspect-square relative", className)}
        ref={ref}
        {...props}
      >
        <svg
          viewBox={`0 0 ${dimension} ${dimension}`}
          xmlns="http://www.w3.org/2000/svg"
          className={cn("aspect-square size-full", svgClassName)}
          {...restSvgProps}
        >
          <circle
            cx="50%"
            cy="50%"
            r={dimension / 2 - finalStrokeWidth / 2}
            strokeWidth={finalStrokeWidth}
            className={cn("stroke-black/5 fill-none", ringClassName)}
            {...restRingProps}
          />
          <circle
            cx="50%"
            cy="50%"
            r={dimension / 2 - finalStrokeWidth / 2}
            className={cn("stroke-amber-500 fill-none", sectionClassName)}
            strokeDashoffset={25}
            strokeDasharray={`${value}, ${100 - value}`}
            pathLength="100"
            strokeLinecap="round"
            strokeWidth={finalStrokeWidth}
            {...restSectionProps}
          />
        </svg>
        <div className="absolute inset-0 flex justify-center items-center">
          {children}
        </div>
      </div>
    );
  }
);
RingProgress.displayName = "RingProgress";

export { RingProgress };
