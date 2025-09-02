import { PersonalIncome } from "@/components/PersonalIncome/PersonalIncome";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { RiArrowDownSLine } from "react-icons/ri";

export const Route = createFileRoute("/compare")({
  component: Layout,
});

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
              {budgetName}
              <RiArrowDownSLine className="-mr-1 inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName: "2024",
                  secondBudgetName,
                }}
                activeProps={{ className: "font-bold" }}
              >
                2024
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName: "2025",
                  secondBudgetName,
                }}
                activeProps={{ className: "font-bold" }}
              >
                2025
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName: "2026",
                  secondBudgetName,
                }}
                activeProps={{ className: "font-bold" }}
              >
                2026
              </Link>
            </DropdownMenuItem>
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
              {secondBudgetName}
              <RiArrowDownSLine className="-mr-1 inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName,
                  secondBudgetName: "2024",
                }}
                activeProps={{ className: "font-bold" }}
              >
                2024
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName,
                  secondBudgetName: "2025",
                }}
                activeProps={{ className: "font-bold" }}
              >
                2025
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/compare/$budgetName/$secondBudgetName"
                params={{
                  budgetName,
                  secondBudgetName: "2026",
                }}
                activeProps={{ className: "font-bold" }}
              >
                2026
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("max-w-3xl shrink grow overflow-y-auto pb-16")}>
        <Outlet />
      </div>
      <PersonalIncome className="absolute inset-x-0 bottom-0 z-10 max-h-full max-w-3xl" />
    </div>
  );
}
