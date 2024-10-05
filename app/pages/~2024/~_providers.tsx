import { BudgetProvider } from "@/components/BudgetProvider/BudgetProvider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers")({
  component: Layout,
});

function Layout() {
  return (
    <BudgetProvider budgetName="2024">
      <Outlet />
    </BudgetProvider>
  );
}
