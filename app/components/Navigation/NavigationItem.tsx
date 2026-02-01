import { Link, type LinkOptions } from "@tanstack/react-router";
import { type ComponentType, type FC, type PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigationCondenseState } from "./NavigationStateProvider";
import { cn } from "@/lib/utils";
import { RiArrowRightSLine } from "react-icons/ri";

export const NavigationItem: FC<
  PropsWithChildren<
    Pick<LinkOptions, "to" | "params" | "disabled"> & {
      Icon?: ComponentType<{ className?: string }>;
      onClick?: () => void;
      subitem?: boolean;
      group?: boolean;
      open?: boolean;
      linkClassName?: string;
      className?: string;
    }
  >
> = ({
  to,
  params,
  disabled,
  children,
  Icon,
  onClick,
  subitem,
  linkClassName,
  group,
  open,
  className,
}) => {
  const [isCondeseState] = useNavigationCondenseState();
  const isCondense = subitem ? false : isCondeseState;

  return (
    <Tooltip delayDuration={100} disableHoverableContent>
      <TooltipTrigger asChild>
        <li
          className={cn(
            { "w-[calc(var(--sidebar-w)-0.75rem)]": group },
            { "md:w-auto": group && isCondense },
            {
              "ml-2": subitem,
            },
            className
          )}
        >
          <Button variant="ghost" asChild>
            <Link
              to={to}
              disabled={disabled}
              params={params}
              onClick={onClick}
              activeProps={{
                className: group ? "bg-sand-200" : "bg-white",
              }}
              className={cn(
                "flex w-full justify-between gap-3 rounded-xl rounded-l-none",
                {
                  "md:rounded-none": isCondense,
                  "rounded-xl w-auto": subitem,
                },
                linkClassName
              )}
            >
              <div className="flex items-center justify-between gap-2">
                {Icon && <Icon className="scale-150" />}
                <div
                  className={cn({
                    "md:hidden": isCondense,
                  })}
                >
                  {children}
                </div>
              </div>
              {group && (
                <RiArrowRightSLine
                  className={cn(
                    "translate-x-2 scale-150 transition-transform duration-300",
                    {
                      "rotate-90": open,
                      "md:hidden": isCondense,
                    }
                  )}
                />
              )}
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
