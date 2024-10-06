import { createFileRoute } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";

export const Route = createFileRoute("/2024/_providers/$expenseName")({
  component: ExpensePage,
});

function ExpensePage() {
  return <ExpensesExplorer className="p-1 md:p-3" />;
}
