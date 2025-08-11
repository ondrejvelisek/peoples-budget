import { PersonalIncome } from "@/components/PersonalIncome/PersonalIncome";

import {
  PageTabs,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ui/pageTabs";
import { personalIncomeQueryOptions } from "@/data/personalIncome/personalIncomeHook";
import { useBudgetName } from "@/lib/budget";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
} from "@tanstack/react-router";

export const Route = createFileRoute("/vladni/$budgetName")({
  component: Layout,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      personalIncomeQueryOptions(params.budgetName)
    );
  },
});

function Layout() {
  const budgetName = useBudgetName();
  const expenseMatch = useMatch({
    from: "/vladni/$budgetName/vydaje/$",
    shouldThrow: false,
  });
  const incomeMatch = useMatch({
    from: "/vladni/$budgetName/prijmy/$",
    shouldThrow: false,
  });

  const activeTab = expenseMatch?.routeId ?? incomeMatch?.routeId;

  return (
    <div className={cn("flex h-full flex-col justify-between")}>
      <PageTabs value={activeTab} className={cn("")}>
        <PageTabsList>
          <PageTabsTrigger value="/vladni/$budgetName/vydaje/$" asChild>
            <Link
              to="/vladni/$budgetName/vydaje/$"
              params={{
                budgetName,
                _splat: { expenseKey: [], expenseDimension: undefined },
              }}
            >
              Výdaje
            </Link>
          </PageTabsTrigger>
          <PageTabsTrigger value="/vladni/$budgetName/prijmy/$" asChild>
            <Link
              to="/vladni/$budgetName/prijmy/$"
              params={{
                budgetName,
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
  );
}
