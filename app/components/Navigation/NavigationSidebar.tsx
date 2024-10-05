import { type FC } from "react";

import { cn } from "@/lib/utils";
import { NavigationMenu } from "./NavigationMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useNavigationCondenseState,
  useNavigationOpenState,
} from "./NavigationStateProvider";

export const NavigationSidebar: FC = () => {
  const [isOpen, { close }] = useNavigationOpenState();
  const [isCondese] = useNavigationCondenseState();

  return (
    <div
      className={cn(
        "flex w-full grow -translate-x-3/4 scale-90 flex-col justify-between overflow-y-auto transition-all md:translate-x-0 md:scale-100",
        {
          "translate-x-0 scale-100": isOpen,
        }
      )}
    >
      <div />
      <NavigationMenu className="py-2 pr-2" onItemClick={close} />

      <Tooltip delayDuration={100} disableHoverableContent>
        <TooltipTrigger asChild>
          <footer className="w-fit px-4 py-3 pr-2 text-xs leading-loose text-sand-400">
            <span className={cn({ "inline md:hidden md:size-0": isCondese })}>
              Vytvořeno s{" "}
            </span>
            <span className="text-rose-400">♥︎</span>
            <span className={cn({ "inline md:hidden md:size-0": isCondese })}>
              {" "}
              k Česku
            </span>
          </footer>
        </TooltipTrigger>
        {isCondese && (
          <TooltipContent
            side="right"
            sideOffset={6}
            asChild
            className="m-0 hidden bg-sand-200 text-sand-500 shadow-none md:block"
          >
            <div className="border-none p-3 pl-1 text-xs leading-loose">
              Vytvořeno s láskou k Česku
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};
