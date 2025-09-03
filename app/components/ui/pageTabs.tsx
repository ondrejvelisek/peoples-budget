import * as React from "react";
import * as PageTabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const PageTabs = PageTabsPrimitive.Root;

const PageTabsList = React.forwardRef<
  React.ElementRef<typeof PageTabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof PageTabsPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <div className="relative overflow-hidden -mb-2">
    <PageTabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex pt-0.5 items-center rounded-t-2xl bg-sand-50 text-sand-500 dark:bg-sand-800 dark:text-sand-400 w-full shadow-[inset_0_-2px_0_#F8F2EAFF]",
        className
      )}
      {...props}
    >
      {children}
    </PageTabsPrimitive.List>
    <div className="flex-1 bg-white h-4 rounded-t-2xl shadow-[0px_-16px_0px_16px_#F8F2EAFF] overflow-hidden" />
  </div>
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
      "data-[state=active]:bg-white data-[state=active]:text-sand-950 data-[state=active]:shadow-[-1px_-1px_0_1px_#F8F2EAFF,1px_-1px_0_1px_#F8F2EAFF]",
      "dark:ring-offset-sand-950 dark:focus-visible:ring-sand-300 dark:data-[state=active]:bg-sand-950 dark:data-[state=active]:text-sand-50",
      "before:size-4 before:rounded-br-full before:bg-transparent before:absolute relative before:left-0 before:bottom-0 before:-ml-4 before:shadow-[8px_8px_0px_8px_#FFFFFF00,inset_-1px_-1px_0_1px_#ede5da00] data-[state=active]:before:shadow-[4px_4px_0px_4px_#FFF,inset_-1px_-1px_0_1px_#F8F2EAFF] first:data-[state=active]:before:shadow-[8px_8px_0px_8px_#FFF,inset_-1px_-1px_0_1px_#F8F2EAFF]",
      "after:size-4 after:rounded-bl-full after:bg-transparent after:absolute relative after:right-0 after:bottom-0 after:-mr-4 after:shadow-[-8px_8px_0px_8px_#FFFFFF00,inset_1px_-1px_0_1px_#ede5da00] data-[state=active]:after:shadow-[-4px_4px_0px_4px_#FFF,inset_1px_-1px_0_1px_#F8F2EAFF] last:data-[state=active]:after:shadow-[-8px_8px_0px_8px_#FFF,inset_1px_-1px_0_1px_#F8F2EAFF]",
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
