import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-sand-950 dark:focus-visible:ring-sand-300",
  {
    variants: {
      variant: {
        default:
          "bg-sand-500 text-sand-50 hover:bg-sand-600 dark:bg-sand-50 dark:text-sand-700 dark:hover:bg-sand-50/90",
        destructive:
          "bg-red-500 text-sand-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-sand-50 dark:hover:bg-red-900/90",
        outline:
          "border border-sand-200 bg-white hover:bg-sand-100 hover:text-sand-900 dark:border-sand-800 dark:bg-sand-950 dark:hover:bg-sand-800 dark:hover:text-sand-50",
        secondary:
          "bg-sand-100 text-sand-900 hover:bg-sand-100/80 dark:bg-sand-800 dark:text-sand-50 dark:hover:bg-sand-800/80",
        ghost:
          "hover:bg-sand-100 hover:text-sand-900 dark:hover:bg-sand-800 dark:hover:text-sand-50",
        link: "text-sand-900 underline-offset-4 hover:underline dark:text-sand-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
