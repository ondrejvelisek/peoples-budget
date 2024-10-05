import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers/")({
  component: Page,
});

function Page() {
  return <ExpensesExplorer />;
}
