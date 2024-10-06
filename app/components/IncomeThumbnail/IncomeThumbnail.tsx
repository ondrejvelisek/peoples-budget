import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export const IncomeThumbnail: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex min-h-10 items-center gap-4 p-2 text-2xs text-stone-400",
        className
      )}
    >
      Příjmy
      <Progress
        value={60}
        className="mr-2 h-1 bg-rose-400"
        indicatorProps={{ className: "bg-lime-300" }}
      />
    </div>
  );
};
