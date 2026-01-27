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

function accessChildrenDimensions<D extends Dimension>(
  cookieName: string,
  defaultDimensions: Array<D>,
) {
  const [cookie, setCookie] = accessCookie(cookieName);

  const cookieChildrenDimension = cookie?.split(",") as Array<D> | undefined;

  const currentChildrenDimension = cookieChildrenDimension ?? defaultDimensions;

  function setChildrenDimension(newChildrenDimension: Array<D>) {
    const newChildrenDimensionStr = newChildrenDimension.join(",");
    setCookie(newChildrenDimensionStr);
  }

  return [currentChildrenDimension, setChildrenDimension] as const;
}

export function isDimensionExhausted<D extends Dimension>(
  dimension: D,
  itemKey: ItemKey<D>,
): boolean {
  const maxDimensionCount: Record<Dimension, number> = {
    odvetvi: 4,
    druh: 3,
    urad: 2,
  };
  const count = itemKey.filter(
    (itemPart) => itemPart.dimension === dimension,
  ).length;
  return count >= maxDimensionCount[dimension];
}

function deriveDimension<D extends Dimension>(
  dimensions: Array<D>,
  itemKey: ItemKey<D>,
): D | undefined {
  return dimensions.find(
    (dimension) => !isDimensionExhausted(dimension, itemKey),
  );
}

function deriveDimensions<D extends Dimension>(
  currentDimensions: Array<D>,
  urlItemKey: ItemKey<D>,
  urlDimension: D | undefined,
): Array<D> {
  if (!urlDimension) {
    return currentDimensions;
  }

  const urlDimensionIndex = currentDimensions.findIndex(
    (dimension) => dimension === urlDimension,
  );
  if (urlDimensionIndex === -1) {
    throw new Error(
      `URL dimension ${urlDimension} not found in current dimensions ${currentDimensions}`,
    );
  }

  const dimensionsWithMorePriority = currentDimensions.slice(
    0,
    urlDimensionIndex,
  );

  const isExhausted = dimensionsWithMorePriority.every((dimension) =>
    isDimensionExhausted(dimension, urlItemKey),
  );

  if (isExhausted) {
    return currentDimensions;
  }

  return [
    urlDimension,
    ...currentDimensions.filter((dimension) => dimension !== urlDimension),
  ];
}

export function accessChildrenDimension<D extends Dimension>(
  urlItemKey: ItemKey<D>,
  urlDimension: D | undefined,
  itemKey: ItemKey<D>,
  cookieName: string,
  defaultDimensions: Array<D>,
): D | undefined {
  const [childrenDimensions, persistChildrenDimension] =
    accessChildrenDimensions<D>(cookieName, defaultDimensions);

  if (itemKey.length === urlItemKey.length && urlDimension) {
    return urlDimension;
  }

  const ancestorDimension = urlItemKey[itemKey.length]?.dimension;
  if (ancestorDimension) {
    return ancestorDimension;
  }

  const newDimensions = deriveDimensions<D>(
    childrenDimensions,
    urlItemKey,
    urlDimension,
  );
  persistChildrenDimension(newDimensions);

  const childrenDimension = deriveDimension<D>(newDimensions, itemKey);

  console.log("oldDimensions", childrenDimensions);
  console.log("newDimensions", newDimensions);
  console.log("childrenDimension", childrenDimension);

  return childrenDimension;
}
