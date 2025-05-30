import { accessChildrenExpenseDimension } from "@/data/expenses/expenseDimensions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vladni/$budgetName/")({
  beforeLoad({ params: { budgetName } }) {
    const childrenDimension = accessChildrenExpenseDimension(
      { expenseKey: [], expenseDimension: undefined },
      []
    );
    if (!childrenDimension) {
      throw new Error(`No children dimension found for index route`);
    }
    throw redirect({
      to: "/vladni/$budgetName/vydaje/$",
      params: {
        budgetName,
        _splat: { expenseKey: [], expenseDimension: childrenDimension },
      },
    });
  },
});