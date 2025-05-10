import { accessCookie } from "../cookie";

export const DIMENSIONS = {
  odvetvi: "Odvětví",
  druh: "Druh",
  urad: "Úřad",
} as const;

export type Dimension = keyof typeof DIMENSIONS;

export type Dimensions = Array<Dimension>;

export type ItemKey<D extends Dimension> = Array<{
  dimension: D;
  id: string;
}>;

function accessChildrenDimensions<A extends Array<Dimension>>(
  cookieName: string,
  defaultDimensions: A
) {
  const [cookie, setCookie] = accessCookie(cookieName);

  const cookieChildrenDimension = cookie?.split(",") as A | undefined;

  const currentChildrenDimension = cookieChildrenDimension ?? defaultDimensions;

  function setChildrenDimension(newChildrenDimension: A) {
    const newChildrenDimensionStr = newChildrenDimension.join(",");
    setCookie(newChildrenDimensionStr);
  }

  return [currentChildrenDimension, setChildrenDimension] as const;
}

function shiftDimension<T extends Dimension, A extends Array<T>>(
  array: A,
  newItem: T,
  index: number
): A {
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
  }) as A;
}

export function accessChildrenDimension<
  D extends Dimension,
  A extends Array<D>,
  K extends ItemKey<D>,
>(
  urlItemKey: K,
  urlDimension: D | undefined,
  itemKey: K,
  cookieName: string,
  defaultDimensions: A
): D | undefined {
  const [childrenDimensions, persistChildrenDimension] =
    accessChildrenDimensions<A>(cookieName, defaultDimensions);

  if (itemKey.length === urlItemKey.length && urlDimension) {
    return urlDimension;
  }

  const ancestorDimension = urlItemKey[itemKey.length]?.dimension;
  if (ancestorDimension) {
    return ancestorDimension;
  }

  const dimensions = itemKey
    .map(({ dimension }) => dimension)
    .reduce<A>(shiftDimension, childrenDimensions);

  const childrenDimension = dimensions.at(itemKey.length);

  persistChildrenDimension(dimensions);

  return childrenDimension;
}
