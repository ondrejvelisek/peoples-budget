import { type FC } from "react";
import { type LinkProps } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type ItemProps = LinkProps & {
  className?: string;
};

export const CompareItem: FC<ItemProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-b-2 border-neutral-600/10 border-b-neutral-600/20 border-t-neutral-600/5 px-3 py-2",
        className
      )}
    >
      <div>Služby pro obyvatelstvo</div>
      <div className="flex gap-2">
        <div className="grow font-bold">
          <div className="">267 mld.</div>
          <div className="text-sm">16 141 Kč</div>
        </div>
        <div className="border-l border-neutral-600/10" />
        <div className="grow font-bold text-rose-600">
          <div>-18 mld.</div>
          <div className="text-sm">-3,21 %</div>
        </div>
        <div className="border-l border-neutral-600/10" />
        <div className="grow font-bold">
          <div className="">249 mld.</div>
          <div className="text-sm">14 912 Kč</div>
        </div>
      </div>
    </div>
  );
};
