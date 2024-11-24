import { accessChildrenExpenseDimension } from "@/data/expenseDimensions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers/")({
  beforeLoad() {
    const childrenDimension = accessChildrenExpenseDimension(
      { expenseKey: [], expenseDimension: undefined },
      []
    );
    throw redirect({
      to: "/2024/$",
      params: {
        _splat: { expenseKey: [], expenseDimension: childrenDimension },
      },
    });
  },
});
