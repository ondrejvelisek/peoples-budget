import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";

type BudgetContextValue = {
  budgetName: string;
};

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

export const useBudget = (): BudgetContextValue => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};

export const BudgetProvider: FC<PropsWithChildren<{ budgetName: string }>> = ({
  children,
  budgetName,
}) => {
  return (
    <BudgetContext.Provider value={{ budgetName }}>
      {children}
    </BudgetContext.Provider>
  );
};
