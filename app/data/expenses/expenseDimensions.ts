import { useParams } from "@tanstack/react-router";
import {
  accessChildrenDimension,
  DIMENSIONS,
  type ItemKey,
} from "../dimensions/personalDimensions";

export const EXPENSE_DIMENSIONS = DIMENSIONS;

export type ExpenseDimension = keyof typeof EXPENSE_DIMENSIONS;

export type ExpenseKey = ItemKey<ExpenseDimension>;

export const EXPENSE_DIMENSIONS_COOKIE_NAME = "children_expense_dimension";

export const defaultExpenseDimensions: Array<ExpenseDimension> = [
  "odvetvi",
  "druh",
  "urad",
];

export type ExpensesSplatParam = {
  expenseKey: ExpenseKey;
  expenseDimension: ExpenseDimension | undefined;
};

export const useUrlExpenseSplat = (): ExpensesSplatParam => {
  const splat = useParams({ strict: false })._splat;
  if (!splat || !("expenseKey" in splat)) {
    throw new Error("useUrlExpenseSplat: Missing splat in url");
  }
  return splat;
};

export const isExpenseDimension = (
  value?: string,
): value is ExpenseDimension | undefined =>
  value === undefined || ["odvetvi", "druh", "urad"].includes(value);

export function accessChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey,
) {
  return accessChildrenDimension<ExpenseDimension>(
    splat.expenseKey,
    splat.expenseDimension,
    expenseKey,
    EXPENSE_DIMENSIONS_COOKIE_NAME,
    defaultExpenseDimensions,
  );
}

export function useChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey,
) {
  return accessChildrenExpenseDimension(splat, expenseKey);
}
