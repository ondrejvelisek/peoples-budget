import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={cn("group", className)}
    {...props}
  />
));
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    innerClassName?: string;
    animate?: boolean;
    disableOnDesktop?: boolean;
  }
>(
  (
    {
      className,
      innerClassName,
      children,
      animate = true,
      disableOnDesktop = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        animate &&
          "transition-[grid-template-rows,opacity,transform] duration-300 ease-out",
        "grid-rows-[0fr] opacity-0 -translate-x-2 -translate-y-2 scale-90",
        "group-data-[state=open]:grid-rows-[1fr] group-data-[state=open]:opacity-100 group-data-[state=open]:translate-x-0 group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-100",
        {
          "md:group-data-[state=open]:grid-rows-[0fr] md:group-data-[state=open]:opacity-0 md:group-data-[state=open]:-translate-x-2 md:group-data-[state=open]:-translate-y-2 md:group-data-[state=open]:scale-90":
            disableOnDesktop,
        },
        className
      )}
      {...props}
    >
      <div className={cn("min-h-0 overflow-hidden", innerClassName)}>
        {children}
      </div>
    </div>
  )
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
