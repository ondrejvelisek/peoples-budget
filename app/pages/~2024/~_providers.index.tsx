import { useExpense } from "@/data/expenses";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers/")({
  component: Page,
});

function Page() {
  const [expense] = useExpense();
  return (
    <Navigate
      replace
      to="/2024/$expenseName"
      params={{ expenseName: expense.name }}
    />
  );
}
