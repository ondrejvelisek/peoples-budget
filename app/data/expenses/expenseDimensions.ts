import { useParams } from "@tanstack/react-router";
import { accessChildrenDimension, type ItemKey } from "../dimensions";

export const EXPENSE_DIMENSIONS = {
  odvetvi: "Odvětví",
  druh: "Druh",
  urad: "Úřad",
} as const;

export type ExpenseDimension = keyof typeof EXPENSE_DIMENSIONS;

export type ExpenseDimensions = [
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
  ExpenseDimension,
];

export type ExpenseKey = ItemKey<ExpenseDimension>;

export const EXPENSE_DIMENSIONS_COOKIE_NAME = "children_expense_dimension";

export const defaultExpenseDimensions: ExpenseDimensions = [
  "odvetvi",
  "odvetvi",
  "odvetvi",
  "druh",
  "druh",
  "druh",
  "urad",
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
  value?: string
): value is ExpenseDimension | undefined =>
  value === undefined || ["odvetvi", "druh", "urad"].includes(value);

export function accessChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey
) {
  return accessChildrenDimension<
    ExpenseDimension,
    ExpenseDimensions,
    ExpenseKey
  >(
    splat.expenseKey,
    splat.expenseDimension,
    expenseKey,
    EXPENSE_DIMENSIONS_COOKIE_NAME,
    defaultExpenseDimensions
  );
}

export function useChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey
) {
  return accessChildrenExpenseDimension(splat, expenseKey);
}
