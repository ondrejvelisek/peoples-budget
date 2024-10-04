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

          <Button
            variant="ghost"
            onClick={() => setIsCondense((prev) => !prev)}
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
        </nav>
        <div
          className={cn(
            "flex grow -translate-x-3/4 scale-90 flex-col justify-between transition-all md:min-w-fit md:translate-x-0 md:scale-100 ",
            {
              "translate-x-0 scale-100": isOpen,
            }
          )}
        >
          <div />
          <NavigationMenu className="pr-2" onItemClick={close} />
          <footer className="px-4 py-3 pr-2 text-xs leading-loose text-sand-400">
            <span className={cn({ "inline md:hidden": isCondese })}>
              Vytvořeno s{" "}
            </span>
            <span className="text-rose-400">♥︎</span>
            <span className={cn({ "inline md:hidden": isCondese })}>
              {" "}
              v Česku
            </span>
          </footer>
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
