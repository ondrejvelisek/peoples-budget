import { useChildrenExpenseDimension } from "@/data/expenses";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/2024/_providers/")({
  component: Page,
});

function Page() {
  const childrenDimension = useChildrenExpenseDimension(0);
  if (!childrenDimension) {
    throw new Error(
      "children expenses cant be shown because children slicing dimension is not defined"
    );
  }

  return (
    <Navigate
      replace
      to="/2024/$"
      params={{
        _splat: { expenseKey: [], expenseDimension: childrenDimension },
      }}
    />
  );
}
