import {
  PageTabs,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ui/pageTabs";
import { personalIncomeQueryOptions } from "@/data/personalIncome/personalIncomeHook";
import { useBudgetName, useSecondBudgetName } from "@/lib/budget";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatch,
} from "@tanstack/react-router";

export const Route = createFileRoute("/compare/$budgetName/$secondBudgetName")({
  component: Layout,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      personalIncomeQueryOptions(params.budgetName)
    );
  },
});

function Layout() {
  const budgetName = useBudgetName();
  const secondBudgetName = useSecondBudgetName();
  const expenseMatch = useMatch({
    from: "/compare/$budgetName/$secondBudgetName/vydaje/$",
    shouldThrow: false,
  });
  const incomeMatch = useMatch({
    from: "/compare/$budgetName/$secondBudgetName/prijmy/$",
    shouldThrow: false,
  });

  const activeTab = expenseMatch?.routeId ?? incomeMatch?.routeId;

  return (
    <div className={cn("flex h-full flex-col justify-between")}>
      <PageTabs value={activeTab} className={cn("bg-sand-50")}>
        <PageTabsList>
          <PageTabsTrigger
            value="/compare/$budgetName/$secondBudgetName/vydaje/$"
            asChild
          >
            <Link
              to="/compare/$budgetName/$secondBudgetName/vydaje/$"
              params={{
                budgetName,
                secondBudgetName,
                _splat: { expenseKey: [], expenseDimension: undefined },
              }}
            >
              Výdaje
            </Link>
          </PageTabsTrigger>
          <PageTabsTrigger
            value="/compare/$budgetName/$secondBudgetName/prijmy/$"
            asChild
          >
            <Link
              className=""
              to="/compare/$budgetName/$secondBudgetName/prijmy/$"
              params={{
                budgetName,
                secondBudgetName,
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
    </div>
  );
}
