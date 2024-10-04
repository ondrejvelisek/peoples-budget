import { Link } from "@tanstack/react-router";
import { type FC, type PropsWithChildren } from "react";

import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn, withProviders } from "@/lib/utils";
import { NavigationMenu } from "./NavigationMenu";
import { GiLion } from "react-icons/gi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  NavigationStateProvider,
  useNavigationCondenseState,
  useNavigationOpenState,
} from "./NavigationStateProvider";

const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, { toggle: toggleOpen, close }] = useNavigationOpenState();
  const [isCondese, setIsCondense] = useNavigationCondenseState();

  return (
    <div className="relative flex size-full overflow-hidden">
      <div className="flex size-full flex-col md:w-[220px]">
        <nav className="flex justify-between">
          <Button
            variant="ghost"
            asChild
            className={cn("transition-opacity", {
              "opacity-100 md:opacity-0": isCondese,
            })}
          >
            <Link to="/" onClick={close}>
              <GiLion className="mr-2 inline-block scale-150 text-rose-700" />
              <strong>Lidový rozpočet</strong>
            </Link>
          </Button>

          <Button variant="ghost" onClick={toggleOpen} className="md:hidden">
            {isOpen ? (
              <RiCloseLine className="scale-150" />
            ) : (
              <RiMenuLine className="scale-150" />
            )}
          </Button>

          <Tooltip
            disableHoverableContent
            delayDuration={isCondese ? 100 : 500}
          >
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setIsCondense(!isCondese)}
                className={cn("hidden transition-transform md:block", {
                  "-translate-x-[calc(220px-100%)]": isCondese,
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
            <TooltipContent side={isCondese ? "right" : "bottom"} asChild>
              <p>{isCondese ? "Rozbalit menu" : "Sbalit menu"}</p>
            </TooltipContent>
          </Tooltip>
        </nav>
        <div
          className={cn(
            "flex grow -translate-x-3/4 scale-90 flex-col justify-between overflow-y-auto transition-all md:min-w-fit md:translate-x-0 md:scale-100",
            {
              "translate-x-0 scale-100": isOpen,
            }
          )}
        >
          <div />
          <NavigationMenu className="pr-2 pt-2" onItemClick={close} />

          <Tooltip delayDuration={100} disableHoverableContent>
            <TooltipTrigger asChild>
              <footer className="w-fit px-4 py-3 pr-2 text-xs leading-loose text-sand-400">
                <span
                  className={cn({ "inline md:hidden md:size-0": isCondese })}
                >
                  Vytvořeno s{" "}
                </span>
                <span className="text-rose-400">♥︎</span>
                <span
                  className={cn({ "inline md:hidden md:size-0": isCondese })}
                >
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
      </div>

      <div
        onClick={close}
        className={cn(
          "absolute inset-x-0 bottom-0 top-10 rounded-t-xl bg-white transition-all md:left-[220px] md:top-0 md:rounded-l-xl md:rounded-r-none",
          {
            "rounded-l-xl translate-x-[200px] md:translate-x-0 scale-90 md:scale-100 botom-0 md:bottom-0":
              isOpen,
            "md:left-11": isCondese,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default withProviders<PropsWithChildren>(NavigationStateProvider)(
  Navigation
);
