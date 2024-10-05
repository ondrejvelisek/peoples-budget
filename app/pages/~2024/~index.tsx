import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/")({
  component: Home,
});

function Home() {
  return <ExpensesExplorer />;
}
