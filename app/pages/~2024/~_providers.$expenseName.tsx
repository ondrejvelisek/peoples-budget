import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { useExpense } from "@/data/expenses";

export const Route = createFileRoute("/2024/_providers/$expenseName")({
  component: ExpensePage,
});

function ExpensePage() {
  const { expenseName } = Route.useParams();

  const [, , parent] = useExpense(expenseName);
  if (!parent) {
    return <Navigate replace to="/2024" />;
  }

  return <ExpensesExplorer expenseName={expenseName} />;
}
