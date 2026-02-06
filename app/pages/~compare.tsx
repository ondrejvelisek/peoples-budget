import { PersonalIncome } from "@/components/PersonalIncome/PersonalIncome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemLink,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { cn, MySuspense } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RiArrowDownSLine } from "react-icons/ri";
import * as z from "zod/mini";

export const Route = createFileRoute("/compare")({
  component: Layout,
  validateSearch: z.object({
    health: z._default(z.boolean(), true),
  }),
});

const budgetNameToTitle: Record<string, string> = {
  "2026-Babis": "2026 Babiš",
  "2026-Fiala": "2026 Fiala",
  "2025": "2025",
  "2024": "2024",
};

function Layout() {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();

  return (
    <div className={cn("flex h-full flex-col justify-between")}>
      <div className="bg-sand-50 px-3 py-2">
        Porovnání{" "}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("inline")} asChild>
            <Button
              size="xs"
              variant="outline"
              className="border-2 border-sand-100"
            >
              {budgetNameToTitle[budgetName]}
              <RiArrowDownSLine className="-mr-1 inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName: "2026-Babis",
                secondBudgetName,
              }}
            >
              2026 Babiš
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName: "2026-Fiala",
                secondBudgetName,
              }}
            >
              2026 Fiala
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName: "2025",
                secondBudgetName,
              }}
            >
              2025
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName: "2024",
                secondBudgetName,
              }}
            >
              2024
            </DropdownMenuItemLink>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        proti{" "}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn("inline")} asChild>
            <Button
              size="xs"
              variant="outline"
              className="border-2 border-sand-100"
            >
              {budgetNameToTitle[secondBudgetName]}
              <RiArrowDownSLine className="-mr-1 inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName,
                secondBudgetName: "2026-Babis",
              }}
            >
              2026 Babiš
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName,
                secondBudgetName: "2026-Fiala",
              }}
            >
              2026 Fiala
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName,
                secondBudgetName: "2025",
              }}
            >
              2025
            </DropdownMenuItemLink>
            <DropdownMenuItemLink
              to="/compare/$budgetName/$secondBudgetName"
              params={{
                budgetName,
                secondBudgetName: "2024",
              }}
            >
              2024
            </DropdownMenuItemLink>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("max-w-3xl shrink grow overflow-y-auto pb-16")}>
        <Outlet />
      </div>
      <MySuspense>
        <PersonalIncome className="absolute inset-x-0 bottom-0 z-10 max-h-full max-w-3xl" />
      </MySuspense>
    </div>
  );
}
