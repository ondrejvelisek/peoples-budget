import { Link, type LinkProps } from "@tanstack/react-router";
import { type ComponentType, type FC, type PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigationCondenseState } from "./NavigationStateProvider";
import { cn } from "@/lib/utils";

export const NavigationItem: FC<
  PropsWithChildren<
    Pick<LinkProps, "to" | "params"> & {
      Icon?: ComponentType<{ className?: string }>;
      onClick?: () => void;
      subitem?: boolean;
      linkClassName?: string;
    }
  >
> = ({ to, params, children, Icon, onClick, subitem, linkClassName }) => {
  const [isCondeseState] = useNavigationCondenseState();
  const isCondense = subitem ? false : isCondeseState;

  return (
    <Tooltip delayDuration={100} disableHoverableContent>
      <TooltipTrigger asChild>
        <li className={cn({ "": subitem })}>
          <Button variant="ghost" asChild>
            <Link
              to={to}
              params={params}
              onClick={onClick}
              activeProps={{
                className: subitem ? "bg-sand-200" : "bg-white",
              }}
              className={cn(
                "flex gap-3 rounded-xl rounded-l-none",
                {
                  "md:rounded-none": isCondense,
                  "rounded-lg": subitem,
                },
                linkClassName
              )}
            >
              {Icon && <Icon className="scale-150" />}
              <div
                className={cn({
                  "md:hidden": isCondense,
                })}
              >
                {children}
              </div>
            </Link>
          </Button>
        </li>
      </TooltipTrigger>
      {isCondense && (
        <TooltipContent
          side="right"
          sideOffset={-4}
          className="m-0 -ml-1 hidden rounded-l-none border-none bg-sand-100 p-0 shadow-none md:block"
        >
          <Button variant="ghost" className="rounded-xl rounded-l-none pl-1">
            {children}
          </Button>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
