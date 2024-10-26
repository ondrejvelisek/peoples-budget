import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers/")({
  beforeLoad: () =>
    redirect({
      to: "/2024/$",
      params: { _splat: { expenseKey: [], expenseDimension: "odvetvi" } },
    }),
});
