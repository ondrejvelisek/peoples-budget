import { type FC } from "react";
import {
  RiGovernmentLine,
  RiUser3Line,
  RiScales3Line,
  RiHome3Line,
  RiHandHeartLine,
} from "react-icons/ri";

import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { PiClockBold } from "react-icons/pi";
import { PiClockClockwiseBold } from "react-icons/pi";

import { GrGroup } from "react-icons/gr";
import { TbArrowsMinimize } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./NavigationItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDisclosure } from "@mantine/hooks";
import { InProgress } from "../InProgress/InProgress";

export const NavigationMenu: FC<{
  className?: string;
  onItemClick?: () => void;
}> = ({ className, onItemClick }) => {
  const [isVladniOpen, { open, close }] = useDisclosure(false);
  return (
    <nav>
      <ul className={cn("flex flex-col items-start gap-4", className)}>
        <NavigationItem to="/" onClick={onItemClick} Icon={RiHome3Line}>
          O projektu
        </NavigationItem>
        <DropdownMenu
          open={isVladniOpen}
          onOpenChange={(opened) => (opened ? open() : close())}
        >
          <DropdownMenuTrigger>
            <NavigationItem
              to="/vladni"
              disabled
              Icon={RiGovernmentLine}
              linkClassName={cn({ "bg-white": isVladniOpen })}
            >
              Vládní rozpočet
            </NavigationItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-2 mt-1 list-none rounded-xl">
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2026" }}
              onClick={() => {
                onItemClick?.();
                close();
              }}
              Icon={PiClockClockwiseBold}
              subitem
            >
              Přípravy 2026
            </NavigationItem>
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2025" }}
              onClick={() => {
                onItemClick?.();
                close();
              }}
              Icon={PiClockBold}
              subitem
            >
              Aktuální 2025
            </NavigationItem>
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2024" }}
              onClick={() => {
                onItemClick?.();
                close();
              }}
              Icon={PiClockCounterClockwiseBold}
              subitem
            >
              Archiv 2024
            </NavigationItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NavigationItem
          to="/compare"
          onClick={() => {
            onItemClick?.();
            close();
          }}
          Icon={RiScales3Line}
        >
          Porovnat rozpočty
        </NavigationItem>
        <InProgress>
          <NavigationItem to="/my" Icon={RiUser3Line} disabled>
            Můj Rozpočet
          </NavigationItem>
        </InProgress>
        <InProgress>
          <NavigationItem to="/published" disabled Icon={GrGroup}>
            Rozpočty lidí
          </NavigationItem>
        </InProgress>
        <InProgress>
          <NavigationItem to="/agregated" disabled Icon={TbArrowsMinimize}>
            Agregovaný rozpočet
          </NavigationItem>
        </InProgress>
        <NavigationItem
          to="/support"
          onClick={onItemClick}
          Icon={RiHandHeartLine}
        >
          Podpořit projekt
        </NavigationItem>
      </ul>
    </nav>
  );
};
