import { Link } from "@tanstack/react-router";
import { type FC } from "react";

import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "./logo-144x90.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useNavigationCondenseState,
  useNavigationOpenState,
} from "./NavigationStateProvider";

export const NavigationHeader: FC = () => {
  const [isOpen, { toggle: toggleOpen, close }] = useNavigationOpenState();
  const [isCondese, setIsCondense] = useNavigationCondenseState();

  return (
    <nav className="flex justify-between">
      <Button
        variant="ghost"
        asChild
        className={cn("transition-opacity", {
          "opacity-100 md:opacity-0": isCondese,
        })}
      >
        <Link to="/" onClick={close}>
          <img src={logoImg} className="h-full mr-1" />
          <span className="font-serif text-sand-600 font-bold">
            Lidový rozpočet
          </span>
        </Link>
      </Button>

      <Button variant="ghost" onClick={toggleOpen} className="md:hidden">
        {isOpen ? (
          <RiCloseLine className="scale-150" />
        ) : (
          <RiMenuLine className="scale-150" />
        )}
      </Button>

      <Tooltip disableHoverableContent delayDuration={isCondese ? 100 : 500}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => setIsCondense(!isCondese)}
            className={cn("hidden transition-transform duration-300 md:block", {
              "-translate-x-[calc(var(--sidebar-w)-100%)]": isCondese,
              "text-sand-500": !isCondese,
            })}
          >
            {isCondese ? (
              <TbLayoutSidebarLeftExpandFilled className="scale-150" />
            ) : (
              <TbLayoutSidebarLeftCollapseFilled className="scale-150" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isCondese ? "right" : "bottom"}>
          {isCondese ? "Rozbalit menu" : "Sbalit menu"}
        </TooltipContent>
      </Tooltip>
    </nav>
  );
};
