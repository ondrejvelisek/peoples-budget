import { useParams } from "@tanstack/react-router";
import {
  accessChildrenDimension,
  DIMENSIONS,
  type ItemKey,
} from "../dimensions/personalDimensions";
import lodash from "lodash";
const { omit } = lodash;

export const INCOME_DIMENSIONS = omit(DIMENSIONS, "odvetvi");

export type IncomeDimension = keyof typeof INCOME_DIMENSIONS;

export type IncomeDimensions = [
  IncomeDimension,
  IncomeDimension,
  IncomeDimension,
  IncomeDimension,
  IncomeDimension,
];

export type IncomeKey = ItemKey<IncomeDimension>;

const INCOME_DIMENSIONS_COOKIE_NAME = "children_income_dimension";

const defaultIncomeDimensions: IncomeDimensions = [
  "druh",
  "druh",
  "druh",
  "urad",
  "urad",
];

export type IncomeSplatParam = {
  incomeKey: IncomeKey;
  incomeDimension: IncomeDimension | undefined;
};

export const useUrlIncomeSplat = (): IncomeSplatParam => {
  const splat = useParams({ strict: false })._splat;
  if (!splat || !("incomeKey" in splat)) {
    throw new Error("useUrlIncomeSplat: Missing splat in url");
  }
  return splat;
};

export const isIncomeDimension = (
  value?: string
): value is IncomeDimension | undefined =>
  value === undefined || ["druh", "urad"].includes(value);

export function accessChildrenIncomeDimension(
  splat: IncomeSplatParam,
  incomeKey: IncomeKey
) {
  return accessChildrenDimension<IncomeDimension, IncomeDimensions, IncomeKey>(
    splat.incomeKey,
    splat.incomeDimension,
    incomeKey,
    INCOME_DIMENSIONS_COOKIE_NAME,
    defaultIncomeDimensions
  );
}

export function useChildrenIncomeDimension(
  splat: IncomeSplatParam,
  incomeKey: IncomeKey
) {
  return accessChildrenIncomeDimension(splat, incomeKey);
}
