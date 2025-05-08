import * as React from "react";
import * as PageTabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const PageTabs = PageTabsPrimitive.Root;

const PageTabsList = React.forwardRef<
  React.ElementRef<typeof PageTabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof PageTabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <PageTabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-t-2xl bg-sand-50 text-sand-500 dark:bg-sand-800 dark:text-sand-400 w-full shadow-[inset_0_-2px_0_#5C52410F,inset_0_1px_0_#FFF]",
      "before:size-4 before:rounded-tl-[50%] before:absolute relative before:left-0 before:bottom-0 before:-mb-4 before:shadow-[-4px_-2px_0_#5C52410F,-4px_-4px_0_#FCF9F6]",
      "after:size-4 after:rounded-tr-[50%] after:absolute relative after:right-0 after:bottom-0 after:-mb-4 after:shadow-[4px_-2px_0_#5C52410F,4px_-4px_0_#FCF9F6]",
      className
    )}
    {...props}
  />
));
PageTabsList.displayName = PageTabsPrimitive.List.displayName;

const PageTabsTrigger = React.forwardRef<
  React.ElementRef<typeof PageTabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PageTabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PageTabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "z-10 inline-flex grow max-w-sm items-center justify-center whitespace-nowrap rounded-t-2xl px-3 py-2 text-sm font-medium ring-offset-white transition-all after:transition-all before:transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-950 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white data-[state=active]:text-sand-950 data-[state=active]:shadow-[-1px_0_0_#5C52410F,-3px_0_0_#5C524109,1px_0_0_#5C52410F,3px_0_0_#5C524109]",
      "before:size-4 before:rounded-br-[50%] before:bg-transparent before:absolute relative before:left-0 before:bottom-0 before:-ml-4 before:shadow-[8px_8px_0_#FFFFFF00,inset_-2px_-2px_0_#5C524100] data-[state=active]:before:shadow-[8px_8px_0_#FFF,inset_-2px_-2px_0_#5C524109]",
      "after:size-4 after:rounded-bl-[50%] after:bg-transparent after:absolute relative after:right-0 after:bottom-0 after:-mr-4 after:shadow-[-8px_0_0_#FFFFFF00,inset_2px_-2px_0_#5C524100] data-[state=active]:after:shadow-[-8px_0_0_#FFF,inset_2px_-2px_0_#5C524109]",
      "dark:ring-offset-sand-950 dark:focus-visible:ring-sand-300 dark:data-[state=active]:bg-sand-950 dark:data-[state=active]:text-sand-50",
      className
    )}
    {...props}
  />
));
PageTabsTrigger.displayName = PageTabsPrimitive.Trigger.displayName;

const PageTabsContent = React.forwardRef<
  React.ElementRef<typeof PageTabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PageTabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PageTabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-950 focus-visible:ring-offset-2 dark:ring-offset-sand-950 dark:focus-visible:ring-sand-300",
      className
    )}
    {...props}
  />
));
PageTabsContent.displayName = PageTabsPrimitive.Content.displayName;

export { PageTabs, PageTabsList, PageTabsTrigger, PageTabsContent };
