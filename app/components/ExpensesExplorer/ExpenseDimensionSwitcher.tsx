import { type FC } from "react";
import { Link, useParams } from "@tanstack/react-router";

export const ExpenseDimensionSwitcher: FC = () => {
  const expenseKey = useParams({ strict: false })._splat?.expenseKey;
  if (!expenseKey) {
    throw new Error("ExpenseDimensionSwitcher: Missing expenseKey in url");
  }
  return (
    <div className="flex gap-2">
      <Link
        to="/2024/$"
        params={{ _splat: { expenseKey, expenseDimension: "odvetvi" } }}
      >
        Odvětví
      </Link>
      <Link
        to="/2024/$"
        params={{ _splat: { expenseKey, expenseDimension: "druh" } }}
      >
        Druh
      </Link>
      <Link
        to="/2024/$"
        params={{ _splat: { expenseKey, expenseDimension: "urad" } }}
      >
        Úřad
      </Link>
    </div>
  );
};
