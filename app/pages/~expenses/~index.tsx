import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses/")({
  component: ExpensePage,
});

function ExpensePage() {
  return (
    <div className="p-2">
      <h3>Expense Page</h3>
    </div>
  );
}
