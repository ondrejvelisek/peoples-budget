import { type FC } from "react";
import {
  RiGovernmentLine,
  RiUser3Line,
  RiScales3Line,
  RiHome3Line,
  RiHandHeartLine,
} from "react-icons/ri";

import { GrGroup } from "react-icons/gr";
import { TbArrowsMinimize } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./NavigationItem";
import { useLocalStorage } from "@mantine/hooks";
import { InProgress } from "../InProgress/InProgress";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useNavigationCondenseState } from "./NavigationStateProvider";

export const NavigationMenu: FC<{
  className?: string;
  onItemClick?: () => void;
}> = ({ className, onItemClick }) => {
  const [isVladniOpen, setIsVladniOpen] = useLocalStorage<boolean>({
    key: "vladni-rozpocet-expanded",
    defaultValue: false,
  });
  const [isCondese, setIsCondese] = useNavigationCondenseState();
  return (
    <nav>
      <ul className={cn("flex flex-col items-start gap-4", className)}>
        <NavigationItem to="/" onClick={onItemClick} Icon={RiHome3Line}>
          O projektu
        </NavigationItem>
        <Collapsible
          open={isVladniOpen}
          onOpenChange={(open) => setIsVladniOpen(open || isCondese)}
        >
          <CollapsibleTrigger className="rounded-lg">
            <NavigationItem
              Icon={RiGovernmentLine}
              to="."
              disabled
              group
              open={isVladniOpen}
              onClick={() => {
                if (isCondese) {
                  setIsCondese(false);
                }
              }}
            >
              Vládní rozpočet
            </NavigationItem>
          </CollapsibleTrigger>
          <CollapsibleContent
            className="relative ml-5 before:absolute before:inset-y-1.5 before:left-0.5 before:w-0.5 before:bg-sand-350"
            innerClassName="flex flex-col gap-1"
            disableOnDesktop={isCondese}
          >
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2026" }}
              onClick={() => {
                onItemClick?.();
              }}
              subitem
              className="pt-1"
            >
              Přípravy 2026
            </NavigationItem>
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2025" }}
              onClick={() => {
                onItemClick?.();
              }}
              subitem
            >
              Aktuální 2025
            </NavigationItem>
            <NavigationItem
              to="/vladni/$budgetName"
              params={{ budgetName: "2024" }}
              onClick={() => {
                onItemClick?.();
              }}
              subitem
            >
              Archiv 2024
            </NavigationItem>
          </CollapsibleContent>
        </Collapsible>
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
