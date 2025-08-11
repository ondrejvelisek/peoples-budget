import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/$budgetName/")({
  loader() {
    // TBD let user choose
    throw redirect({
      to: "/compare/$budgetName/$secondBudgetName",
      params: {
        budgetName: "2025",
        secondBudgetName: "2024",
      },
    });
  },
});
