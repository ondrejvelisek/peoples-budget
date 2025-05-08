import { BudgetProvider } from "@/components/BudgetProvider/BudgetProvider";
import { PersonalIncomeThumbnail } from "@/components/PersonalIncome/PersonalIncomeThumbnail";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/2024")({
  component: Layout2024,
});

function Layout2024() {
  return (
    <BudgetProvider budgetName="2024">
      <div className={cn("flex h-full flex-col justify-between")}>
        <div className={cn("shrink grow overflow-y-auto")}>
          <Outlet />
        </div>
        <Link
          className="shrink-0 rounded-2xl border-t-2 border-sand-600/15 bg-white outline outline-4 outline-sand-600/5"
          to="/2024/vydaje/$"
          style={{
            viewTransitionName: "income-thumbnail",
          }}
          params={{ _splat: { expenseKey: [], expenseDimension: undefined } }}
        >
          <PersonalIncomeThumbnail />
        </Link>
      </div>
    </BudgetProvider>
  );
}
