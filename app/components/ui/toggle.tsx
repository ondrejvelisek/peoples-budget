import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-sand-100 hover:text-sand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-sand-100 data-[state=on]:text-sand-900 dark:ring-offset-sand-950 dark:hover:bg-sand-800 dark:hover:text-sand-400 dark:focus-visible:ring-sand-300 dark:data-[state=on]:bg-sand-800 dark:data-[state=on]:text-sand-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-sand-200 bg-transparent hover:bg-sand-100 hover:text-sand-900 dark:border-sand-800 dark:hover:bg-sand-800 dark:hover:text-sand-50",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
