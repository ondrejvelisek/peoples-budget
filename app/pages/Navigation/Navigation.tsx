import { Link } from "@tanstack/react-router";
import { type FC, type PropsWithChildren } from "react";
import { RiSearch2Line } from "react-icons/ri";

import { RiMenuLine, RiHeart3Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@mantine/hooks";
import { NavigationMenu } from "./NavigationMenu";

export const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, { toggle, close }] = useDisclosure(false);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex h-full flex-col justify-between">
        <nav className="flex justify-between">
          <Button variant="ghost" onClick={toggle} className="md:hidden">
            <RiMenuLine className="scale-150" />
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
        <NavigationMenu
          onItemClick={close}
          className={cn(
            "-translate-x-full scale-90 pr-2 transition-all md:min-w-fit md:translate-x-0 md:scale-100",
            {
              "translate-x-0 scale-100": isOpen,
            }
          )}
        />
        <footer
          className={cn(
            "min-w-[75%] -translate-x-full scale-90 px-4 py-3 pr-2 text-xs leading-loose transition-all md:min-w-fit md:translate-x-0 md:scale-100",
            {
              "translate-x-0 scale-100": isOpen,
            }
          )}
        >
          Vytvořeno s <RiHeart3Fill className="inline" /> v Česku
        </footer>
      </div>

      <div
        onClick={close}
        className={cn(
          "absolute top-20 size-full rounded-t-xl bg-white transition-all md:left-[220px] md:top-0 md:rounded-l-xl md:rounded-r-none",
          {
            "rounded-l-xl translate-x-[75%] scale-90 md:translate-x-0 md:scale-100":
              isOpen,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};
//
