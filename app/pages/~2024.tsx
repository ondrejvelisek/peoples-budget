import { BudgetProvider } from "@/components/BudgetProvider/BudgetProvider";
import { PersonalIncome } from "@/components/PersonalIncome/PersonalIncome";

import {
  PageTabs,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ui/pageTabs";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
} from "@tanstack/react-router";

export const Route = createFileRoute("/2024")({
  component: Layout2024,
});

function Layout2024() {
  const expenseMatch = useMatch({ from: "/2024/vydaje/$", shouldThrow: false });
  const incomeMatch = useMatch({ from: "/2024/prijmy/$", shouldThrow: false });

  const activeTab = expenseMatch?.routeId ?? incomeMatch?.routeId;

  return (
    <BudgetProvider budgetName="2024">
      <div className={cn("flex h-full flex-col justify-between")}>
        <PageTabs value={activeTab} className={cn("")}>
          <PageTabsList>
            <PageTabsTrigger value="/2024/vydaje/$" asChild>
              <Link
                to="/2024/vydaje/$"
                params={{
                  _splat: { expenseKey: [], expenseDimension: undefined },
                }}
              >
                Výdaje
              </Link>
            </PageTabsTrigger>
            <PageTabsTrigger value="/2024/prijmy/$" asChild>
              <Link
                to="/2024/prijmy/$"
                params={{
                  _splat: { incomeKey: [], incomeDimension: undefined },
                }}
              >
                Příjmy
              </Link>
            </PageTabsTrigger>
          </PageTabsList>
        </PageTabs>
        <div className={cn("max-w-3xl shrink grow overflow-y-auto pb-16")}>
          <Outlet />
        </div>
        <PersonalIncome className="absolute inset-x-0 bottom-0 z-10 max-h-full max-w-3xl" />
      </div>
    </BudgetProvider>
  );
}
