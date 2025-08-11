import { useParams } from "@tanstack/react-router";

export const useBudgetName = () => {
  const { budgetName } = useParams({ strict: false });
  if (!budgetName) {
    throw new Error("No budget name defined as URL param");
  }
  return budgetName;
};

export const useSecondBudgetName = () => {
  const { secondBudgetName } = useParams({ strict: false });
  if (!secondBudgetName) {
    throw new Error("No second budget name (to compare) defined as URL param");
  }
  return secondBudgetName;
};
