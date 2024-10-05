import { type FC } from "react";
import {
  RiGovernmentLine,
  RiUser3Line,
  RiTimeLine,
  RiScales3Line,
  RiHome3Line,
  RiHandHeartLine,
} from "react-icons/ri";

import { GrGroup } from "react-icons/gr";
import { TbArrowsMinimize } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./NavigationItem";

export const NavigationMenu: FC<{
  className?: string;
  onItemClick?: () => void;
}> = ({ className, onItemClick }) => {
  return (
    <nav>
      <ul className={cn("flex flex-col items-start gap-4", className)}>
        <NavigationItem to="/" onClick={onItemClick} Icon={RiHome3Line}>
          O projektu
        </NavigationItem>
        <NavigationItem
          to="/2024"
          onClick={onItemClick}
          Icon={RiGovernmentLine}
        >
          Vládní rozpočet 2024
        </NavigationItem>
        <NavigationItem to="/2025" onClick={onItemClick} Icon={RiTimeLine}>
          Vládní rozpočet 2025
        </NavigationItem>
        <NavigationItem to="/my" onClick={onItemClick} Icon={RiUser3Line}>
          Můj rozpočet
        </NavigationItem>
        <NavigationItem to="/published" onClick={onItemClick} Icon={GrGroup}>
          Rozpočty lidí
        </NavigationItem>
        <NavigationItem
          to="/agregated"
          onClick={onItemClick}
          Icon={TbArrowsMinimize}
        >
          Agregovaný rozpočet
        </NavigationItem>
        <NavigationItem
          to="/compare"
          onClick={onItemClick}
          Icon={RiScales3Line}
        >
          Porovnat rozpočty
        </NavigationItem>
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
