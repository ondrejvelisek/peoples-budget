import { BudgetProvider } from "@/components/BudgetProvider/BudgetProvider";
import { ExpenseThumbnail } from "@/components/ExpensesExplorer/ExpenseThumbnail";
import { IncomeThumbnail } from "@/components/IncomesExplorer/IncomeThumbnail";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
  type AnyRouteMatch,
} from "@tanstack/react-router";

export const Route = createFileRoute("/2024")({
  component: Layout2024,
});

function Layout2024() {
  const isIncome = useMatches({
    select: (matches) => !!matches.find(isIncomeMatch),
  });
  return (
    <BudgetProvider budgetName="2024">
      <div className={cn("flex flex-col h-full justify-between")}>
        <div
          className={cn("", {
            "grow-0 shrink-0": !isIncome,
            "grow-1 shrink-1 overflow-y-auto": isIncome,
          })}
        >
          <Link
            to="/2024/prijmy/$"
            params={{ _splat: { incomeKey: [], incomeDimension: undefined } }}
          >
            <IncomeThumbnail />
          </Link>
          {isIncome && <Outlet />}
        </div>
        <div
          className={cn(
            "rounded-t-2xl border-t-2 border-sand-500/10 outline outline-4 outline-sand-500/5",
            {
              "grow-0 shrink-0": isIncome,
              "grow-1 shrink-1 overflow-y-auto": !isIncome,
            }
          )}
        >
          <Link
            to="/2024/vydaje/$"
            params={{ _splat: { expenseKey: [], expenseDimension: undefined } }}
          >
            <ExpenseThumbnail />
          </Link>
          {!isIncome && <Outlet />}
        </div>
      </div>
    </BudgetProvider>
  );
}

function isIncomeMatch(match: AnyRouteMatch): boolean {
  if (match.fullPath.includes("/prijmy")) {
    return true;
  }
  return false;
}
