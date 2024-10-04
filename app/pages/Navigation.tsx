import { Link } from "@tanstack/react-router";
import { type FC, type PropsWithChildren } from "react";
import { RiSearch2Line } from "react-icons/ri";

import { RiMenuLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { NavigationMenu } from "./NavigationMenu";
import { NavigationItem } from "./NavigationItem";

export const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, { toggle, close }] = useDisclosure(false);

  return (
    <div className="flex flex-col h-full">
      <nav className="flex justify-between md:hidden">
        <Button variant="ghost" onClick={toggle}>
          <RiMenuLine />
        </Button>

        <Button variant="ghost" asChild>
          <Link to="/" onClick={close}>
            Lidový rozpočet
          </Link>
        </Button>

        <Button variant="ghost">
          <RiSearch2Line />
        </Button>
      </nav>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col">
          <nav className="justify-between hidden md:flex">
            <Button variant="ghost" asChild>
              <Link to="/" onClick={close}>
                Lidový rozpočet
              </Link>
            </Button>

            <Button variant="ghost">
              <RiSearch2Line />
            </Button>
          </nav>
          <NavigationMenu
            onItemClick={close}
            className={cn(
              "min-w-[75%] -translate-x-full transition-all mt-12 absolute md:relative md:translate-x-0 md:min-w-fit pr-2",
              {
                "translate-x-0": isOpen,
              }
            )}
          />
        </div>
        <div
          onClick={close}
          className={cn("bg-white w-full h-full transition-all", {
            "rounded-2xl translate-x-[75%] scale-95": isOpen,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
