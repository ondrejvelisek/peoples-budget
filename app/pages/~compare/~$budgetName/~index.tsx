import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/$budgetName/")({
  loader() {
    // TBD let user choose
    throw redirect({
      to: "/compare/$budgetName/$secondBudgetName",
      params: {
        budgetName: "2026-Babis",
        secondBudgetName: "2026-Fiala",
      },
    });
  },
});
