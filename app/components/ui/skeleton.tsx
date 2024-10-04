import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-sand-100 dark:bg-sand-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
