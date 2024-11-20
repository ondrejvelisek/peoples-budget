import { expensesDataQueryOptions, useExpensesData } from "@/data/expenses";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Page,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(expensesDataQueryOptions());
  },
});

function Page() {
  const { data } = useExpensesData();
  const initCount =
    (data?.expenses.length ?? 0) +
    (data?.expenses2.length ?? 0) +
    (data?.expenses3.length ?? 0) +
    (data?.expenses4.length ?? 0);
  const [count, setCount] = useState(initCount);

  return (
    <button className="p-4" onClick={() => setCount((prev) => prev + 1)}>
      {count} (TanStart v1.82.1)
    </button>
  );
}
