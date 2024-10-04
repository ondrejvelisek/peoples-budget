import { Link } from "@tanstack/react-router";
import { type ComponentType, type FC, type PropsWithChildren } from "react";
import { RiGovernmentLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import type { FileRouteTypes } from "@/routeTree.gen";

export const NavigationItem: FC<
  PropsWithChildren<{
    to: FileRouteTypes["to"];
    Icon?: ComponentType<{ className?: string }>;
    onClick?: () => void;
  }>
> = ({ to, children, Icon, onClick }) => {
  return (
    <li>
      <Button variant="ghost" asChild className="rounded-xl rounded-l-none">
        <Link to={to} onClick={onClick} activeProps={{ className: "bg-white" }}>
          {Icon && <Icon className="inline mr-2" />}
          {children}
        </Link>
      </Button>
    </li>
  );
};
