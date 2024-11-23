import type { ExpenseKey } from "./expenses";
import { accessCookie } from "./cookie";

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

const EXPENSE_DIMENSIONS_COOKIE_NAME = "children_expense_dimension";

const defaultDimensions: ExpenseDimensions = [
  "odvetvi",
  "odvetvi",
  "odvetvi",
  "druh",
  "druh",
  "druh",
  "urad",
  "urad",
];

function accessChildrenExpenseDimensions() {
  const [cookie, setCookie] = accessCookie(EXPENSE_DIMENSIONS_COOKIE_NAME);

  const cookieChildrenExpenseDimension = cookie?.split(",") as
    | ExpenseDimensions
    | undefined;

  const currentChildrenExpenseDimension =
    cookieChildrenExpenseDimension ?? defaultDimensions;

  function setChildrenExpenseDimension(
    newChildrenExpenseDimension: ExpenseDimensions
  ) {
    const newChildrenExpenseDimensionStr =
      newChildrenExpenseDimension.join(",");
    setCookie(newChildrenExpenseDimensionStr);
  }

  return [
    currentChildrenExpenseDimension,
    setChildrenExpenseDimension,
  ] as const;
}

function shiftDimension(
  array: ExpenseDimensions,
  newItem: ExpenseDimension,
  index: number
): ExpenseDimensions {
  let skip = false;
  return array.map((el, i) => {
    if (i < index) {
      return el;
    }
    if (i === index) {
      return newItem;
    }
    const prev = array[i - 1];
    if (prev === newItem || skip) {
      skip = true;
      return el;
    }
    if (i > index && prev) {
      return prev;
    }
    return el;
  }) as ExpenseDimensions;
}

type ExpensesSplatParam = {
  expenseKey: ExpenseKey;
  expenseDimension: ExpenseDimension | undefined;
};

export function accessChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey
) {
  const { expenseKey: urlExpenseKey, expenseDimension: urlExpenseDimension } =
    splat;
  const [childrenExpenseDimensions, persistChildrenExpenseDimension] =
    accessChildrenExpenseDimensions();

  if (expenseKey.length === urlExpenseKey.length && urlExpenseDimension) {
    return urlExpenseDimension;
  }

  const ancestorDimension = urlExpenseKey[expenseKey.length]?.dimension;
  if (ancestorDimension) {
    return ancestorDimension;
  }

  const expenseDimensions = expenseKey
    .map(({ dimension }) => dimension)
    .reduce<ExpenseDimensions>(shiftDimension, childrenExpenseDimensions);

  const childrenExpenseDimension = expenseDimensions.at(expenseKey.length);

  persistChildrenExpenseDimension(expenseDimensions);

  return childrenExpenseDimension;
}

export function useChildrenExpenseDimension(
  splat: ExpensesSplatParam,
  expenseKey: ExpenseKey
) {
  return accessChildrenExpenseDimension(splat, expenseKey);
}
