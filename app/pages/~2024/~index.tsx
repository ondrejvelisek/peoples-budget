import { BudgetProvider } from "@/components/BudgetProvider/BudgetProvider";
import { accessChildrenExpenseDimension } from "@/data/expenses/expenseDimensions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/")({
  component: Layout2024,
  beforeLoad() {
    const childrenDimension = accessChildrenExpenseDimension(
      { expenseKey: [], expenseDimension: undefined },
      []
    );
    if (!childrenDimension) {
      throw new Error(`No children dimension found for index route`);
    }
    throw redirect({
      to: "/2024/vydaje/$",
      params: {
        _splat: { expenseKey: [], expenseDimension: childrenDimension },
      },
    });
  },
});

function Layout2024() {
  return (
    <BudgetProvider budgetName="2024">
      HERE
      <Outlet />
    </BudgetProvider>
  );
}
