import { getCookie, getResponseHeader, setCookie } from "vinxi/http";
import type { ExpenseKey } from "./expenses";
import loadsh from "lodash";
const { isEqual } = loadsh;

export type ExpenseDimension = "odvetvi" | "druh" | "urad";
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
  const cookie = getCookie(EXPENSE_DIMENSIONS_COOKIE_NAME);
  const cookieChildrenExpenseDimension = cookie?.split(",") as
    | ExpenseDimensions
    | undefined;

  const currentChildrenExpenseDimension =
    cookieChildrenExpenseDimension ?? defaultDimensions;

  const setCookieHeader = getResponseHeader("set-cookie");

  console.error("Current children expense dimensions", setCookieHeader);

  function setChildrenExpenseDimension(
    newChildrenExpenseDimension: ExpenseDimensions
  ) {
    // this deduplicates setting the cookie mulitple times
    if (
      !isEqual(currentChildrenExpenseDimension, newChildrenExpenseDimension) &&
      (!setCookieHeader ||
        (typeof setCookieHeader === "object" && setCookieHeader.length === 0))
    ) {
      const newChildrenExpenseDimensionStr =
        newChildrenExpenseDimension.join(",");
      setCookie(EXPENSE_DIMENSIONS_COOKIE_NAME, newChildrenExpenseDimensionStr);
    }
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

export function accessChildrenExpenseDimension(
  expenseKey: ExpenseKey
): ExpenseDimension | undefined {
  const [childrenExpenseDimensions, persistChildrenExpenseDimension] =
    accessChildrenExpenseDimensions();

  const expenseDimensions = expenseKey
    .map(({ dimension }) => dimension)
    .reduce<ExpenseDimensions>(shiftDimension, childrenExpenseDimensions);

  persistChildrenExpenseDimension(expenseDimensions);

  return expenseDimensions.at(expenseKey.length);
}
