import { accessChildrenExpenseDimension } from "@/data/expenses/expenseDimensions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/$budgetName/$secondBudgetName/")(
  {
    beforeLoad({ params: { budgetName, secondBudgetName } }) {
      const childrenDimension = accessChildrenExpenseDimension(
        { expenseKey: [], expenseDimension: undefined },
        []
      );
      if (!childrenDimension) {
        throw new Error(`No children dimension found for index route`);
      }
      throw redirect({
        to: "/compare/$budgetName/$secondBudgetName/vydaje/$",
        params: {
          budgetName,
          secondBudgetName,
          _splat: { expenseKey: [], expenseDimension: childrenDimension },
        },
      });
    },
  }
);
