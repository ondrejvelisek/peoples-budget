import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/")({
  loader() {
    // TBD let user choose
    throw redirect({
      to: "/compare/$budgetName",
      params: {
        budgetName: "2026-Babis",
      },
    });
  },
});
