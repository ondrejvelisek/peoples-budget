import { type FC } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

export const ExpenseThumbnail: FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex min-h-10 items-center gap-4 px-3 text-2xs text-stone-400",
        className
      )}
    >
      Výdaje
      <Progress
        indicatorsProps={[{ className: "bg-sky-500", value: 70 }]}
        className="mr-1 h-1 bg-amber-400"
      />
    </div>
  );
};
