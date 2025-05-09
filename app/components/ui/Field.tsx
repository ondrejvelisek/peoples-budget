import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const fieldVariants = cva("flex flex-col gap-1");

const Field = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof fieldVariants>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(fieldVariants(), className)} {...props} />
));
Field.displayName = "Field";

const fieldMessageVariants = cva("text-xs leading-tight text-sand-400");

const FieldMessage = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof fieldMessageVariants>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(fieldMessageVariants(), className)} {...props} />
));
FieldMessage.displayName = "FieldMessage";

export { Field, FieldMessage };
