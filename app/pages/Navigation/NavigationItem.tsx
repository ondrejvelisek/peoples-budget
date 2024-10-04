import { Link } from "@tanstack/react-router";
import { type ComponentType, type FC, type PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import type { FileRouteTypes } from "@/routeTree.gen";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigationCondenseState } from "./NavigationStateProvider";
import { cn } from "@/lib/utils";

export const NavigationItem: FC<
  PropsWithChildren<{
    to: FileRouteTypes["to"];
    Icon?: ComponentType<{ className?: string }>;
    onClick?: () => void;
  }>
> = ({ to, children, Icon, onClick }) => {
  const [isCondese] = useNavigationCondenseState();

  return (
    <Tooltip delayDuration={100} disableHoverableContent>
      <TooltipTrigger asChild>
        <li>
          <Button variant="ghost" asChild>
            <Link
              to={to}
              onClick={onClick}
              activeProps={{ className: "bg-white" }}
              className={cn("flex gap-3 rounded-xl rounded-l-none", {
                "md:rounded-none": isCondese,
              })}
            >
              {Icon && <Icon className="scale-150" />}
              <div
                className={cn({
                  "md:hidden": isCondese,
                })}
              >
                {children}
              </div>
            </Link>
          </Button>
        </li>
      </TooltipTrigger>
      {isCondese && (
        <TooltipContent
          side="right"
          sideOffset={-4}
          className="m-0 hidden rounded-l-none border-none bg-sand-100 shadow-none md:block"
          asChild
        >
          <Button variant="ghost" className="rounded-xl rounded-l-none pl-1">
            {children}
          </Button>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
