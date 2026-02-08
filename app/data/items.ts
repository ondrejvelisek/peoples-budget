import isEqual from "lodash/isEqual";
import { parseCsv } from "@/lib/utils";
import { getRecordTables, type RecordTables } from "./dimensions/recordTables";
import { kvStorage } from "./kvStorage";
import { createStorage, prefixStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import type { Dimension, ItemKey } from "./dimensions/personalDimensions";
import { getBudgetFile } from "./files/files";

const itemsMemoryStorage = createStorage<
  ItemWithChildrenAmount<Dimension> | "null"
>({
  driver: memoryDriver(),
});

const itemsStorage = import.meta.env.DEV
  ? itemsMemoryStorage
  : prefixStorage<ItemWithChildrenAmount<Dimension> | "null">(
      kvStorage,
      "items:"
    );

export type Item<D extends Dimension> = {
  key: ItemKey<D>;
  title: string;
  amount: number;
  children: Array<ItemKey<D>>;
  childrenDimension?: D;
  parent?: ItemKey<D>;
};

export type DataRecord = {
  sector_id?: number; // income items does not have sector_id, but lazy to make it conditioanlly generic
  type_id: number;
  office_id: number;
  amount: number;
};

function reduceAmount<D extends Dimension>(
  record: DataRecord,
  acc?: ItemWithChildrenAmount<D>
) {
  return acc ? acc.amount + record.amount : record.amount;
}

function reduceTitle<D extends Dimension>(
  itemKey: ItemKey<D>,
  { sectors, types, offices }: RecordTables,
  rootTitle: string
): string {
  const lastKey = itemKey.at(-1);
  if (!lastKey) {
    return rootTitle;
  }
  if (lastKey.dimension === "odvetvi") {
    const sector = sectors[lastKey.id];
    return sector?.name ?? "Neznámé odvětví";
  }
  if (lastKey.dimension === "druh") {
    const type = types[lastKey.id];
    return type?.name ?? "Neznámý druh";
  }
  if (lastKey.dimension === "urad") {
    const office = offices[lastKey.id];
    return office?.name ?? "Neznámý úřad";
  }
  throw new Error(`Invalid dimension A: ${lastKey.dimension}`);
}

function reduceParent<D extends Dimension>(itemKey: ItemKey<D>, acc?: Item<D>) {
  return itemKey.length
    ? acc?.parent
      ? acc.parent
      : itemKey.slice(0, -1)
    : undefined;
}

type ItemKeyWithAmount<D extends Dimension> = {
  itemKey: ItemKey<D>;
  amount: number;
};

export type ItemWithChildrenAmount<D extends Dimension> = Omit<
  Item<D>,
  "children"
> & {
  children: Array<ItemKeyWithAmount<D>>;
};

function reduceChildren<D extends Dimension>(
  itemKey: ItemKey<D>,
  dimension: D | undefined,
  record: DataRecord,
  acc?: ItemWithChildrenAmount<D>
): Array<ItemKeyWithAmount<D>> {
  let id: undefined | string;
  if (dimension === "odvetvi") {
    const numOfSectorDimensions =
      itemKey.filter(({ dimension }) => dimension === "odvetvi").length + 1;
    if (numOfSectorDimensions <= 4) {
      const numOfSectorChars = numOfSectorDimensions;
      id = String(record.sector_id).slice(0, numOfSectorChars);
    }
  }
  if (dimension === "druh") {
    const numOfTypeDimensions =
      itemKey.filter(({ dimension }) => dimension === "druh").length + 1;
    if (numOfTypeDimensions <= 3) {
      const numOfTypeChars =
        numOfTypeDimensions === 0 ? 0 : numOfTypeDimensions + 1;
      id = String(record.type_id).slice(0, numOfTypeChars);
    }
  }
  if (dimension === "urad") {
    const numOfOfficeDimensions =
      itemKey.filter(({ dimension }) => dimension === "urad").length + 1;
    if (numOfOfficeDimensions <= 2) {
      const numOfOfficeChars =
        numOfOfficeDimensions === 0 ? 0 : numOfOfficeDimensions === 1 ? 3 : 7;
      id = String(record.office_id).slice(0, numOfOfficeChars);
    }
  }
  if (!dimension || !id) {
    return acc?.children ?? [];
  }

  const child: ItemKeyWithAmount<D> = {
    itemKey: [...itemKey, { dimension, id }],
    amount: record.amount,
  };

  const existingChild =
    acc &&
    acc.children.find((ch) =>
      ch.itemKey.every((item, idx) => isEqual(item, child.itemKey[idx]))
    );

  if (existingChild) {
    existingChild.amount += record.amount;
    return acc.children;
  }

  const children = acc?.children ?? [];

  children.push(child);

  return children;
}

export const getItem = async <D extends Dimension>(
  budgetName: string,
  type: "expenses" | "incomes",
  rootTitle: string,
  itemKey: ItemKey<D>,
  healthInsurance: boolean,
  childrenDimension?: D
): Promise<Item<D> | undefined> => {
  const itemWithChildrenAmount = await getItemWithChildrenAmount(
    budgetName,
    type,
    rootTitle,
    itemKey,
    healthInsurance,
    childrenDimension
  );
  return convertItemWithChildrenAmountToItem(itemWithChildrenAmount);
};

export const getItemWithChildrenAmount = async <D extends Dimension>(
  budgetName: string,
  type: "expenses" | "incomes",
  rootTitle: string,
  itemKey: ItemKey<D>,
  healthInsurance: boolean,
  childrenDimension?: D
): Promise<ItemWithChildrenAmount<D> | undefined> => {
  const cacheKeyStr = JSON.stringify([
    budgetName,
    type,
    itemKey,
    healthInsurance,
    childrenDimension,
  ]);

  const memoryCached = await itemsMemoryStorage.getItem<
    ItemWithChildrenAmount<D> | "null"
  >(cacheKeyStr);
  if (memoryCached) {
    console.log("CACHE(getItem): memory HIT", cacheKeyStr);
    return memoryCached === "null" ? undefined : memoryCached;
  }
  try {
    const cached = await itemsStorage.getItem<
      ItemWithChildrenAmount<D> | "null"
    >(cacheKeyStr);
    if (cached) {
      console.log("CACHE(getItem): HIT", cacheKeyStr);
      return cached === "null" ? undefined : cached;
    }
  } catch (error) {
    console.error("CACHE(getItem): ERROR", cacheKeyStr, error);
  }
  console.log("CACHE(getItem): MISS", cacheKeyStr);

  const csv = await getBudgetFile(budgetName, type);
  const tables = await getRecordTables();

  function filter(record: DataRecord) {
    const isHealthInsurance = String(record.office_id).startsWith("9");
    if (!healthInsurance && isHealthInsurance) {
      return false;
    }
    return itemKey.every(({ dimension, id }) => {
      if (dimension === "odvetvi") {
        return String(record.sector_id).startsWith(id);
      }
      if (dimension === "druh") {
        return String(record.type_id).startsWith(id);
      }
      if (dimension === "urad") {
        return String(record.office_id).startsWith(id);
      }
      throw new Error(`Invalid dimension B: ${dimension}`);
    });
  }

  function reduce(
    record: DataRecord,
    acc: ItemWithChildrenAmount<D> | undefined
  ): ItemWithChildrenAmount<D> {
    if (!acc) {
      return {
        key: itemKey,
        title: reduceTitle(itemKey, tables, rootTitle),
        amount: reduceAmount(record),
        children: reduceChildren(itemKey, childrenDimension, record),
        parent: reduceParent(itemKey),
        childrenDimension,
      };
    }
    // more performant than creating new object
    acc.amount = reduceAmount(record, acc);
    acc.children = reduceChildren(itemKey, childrenDimension, record, acc);
    return acc;
  }

  const item = await parseCsv<
    DataRecord,
    ItemWithChildrenAmount<D> | undefined
  >(csv, filter, reduce);

  item?.children.sort((a, b) => b.amount - a.amount);

  await itemsMemoryStorage.setItem(cacheKeyStr, item ?? "null");
  try {
    await itemsStorage.setItem(cacheKeyStr, item ?? "null");
  } catch (error) {
    console.error("CACHE(setItem): ERROR", cacheKeyStr, error);
  }
  return item;
};

export type CompareItem<D extends Dimension> = Item<D> & {
  primaryAmount: number;
  secondaryAmount: number;
  maxChildrenAmount: number;
};

const areKeysEqual = <D extends Dimension>(
  a: ItemKeyWithAmount<D>,
  b: ItemKeyWithAmount<D>
): boolean => {
  return a.itemKey.every((part, i) => {
    return isEqual(part, b.itemKey[i]);
  });
};

export const getCompareItem = async <D extends Dimension>(
  budgetName: string,
  secondBudgetName: string,
  type: "expenses" | "incomes",
  rootTitle: string,
  itemKey: ItemKey<D>,
  healthInsurance: boolean,
  childrenDimension?: D
): Promise<CompareItem<D>> => {
  const itemPromise = getItemWithChildrenAmount(
    budgetName,
    type,
    rootTitle,
    itemKey,
    healthInsurance,
    childrenDimension
  );
  const secondItemPromise = getItemWithChildrenAmount(
    secondBudgetName,
    type,
    rootTitle,
    itemKey,
    healthInsurance,
    childrenDimension
  );

  const [item, secondItem] = await Promise.all([
    itemPromise,
    secondItemPromise,
  ] as const);

  const allChildren = (item?.children ?? []).concat(
    (secondItem?.children ?? []).filter((secCh) => {
      return !(item?.children ?? []).find((primCh) => {
        return areKeysEqual(primCh, secCh);
      });
    })
  );

  const allChildrenWithDiffAmount = allChildren.map((ch) => {
    const a =
      (item?.children ?? []).find((pCh) => areKeysEqual(pCh, ch))?.amount ?? 0;
    const b =
      (secondItem?.children ?? []).find((sCh) => areKeysEqual(sCh, ch))
        ?.amount ?? 0;
    return Object.assign(ch, { amount: a - b });
  });

  const children = allChildrenWithDiffAmount.toSorted((a, b) => {
    return Math.abs(b.amount) - Math.abs(a.amount);
  });

  const maxChildrenAmount = children[0]?.amount ?? 0;

  const someItem = item ?? secondItem;
  if (!someItem) {
    console.log("prm item", item);
    console.log("sec item", secondItem);
    console.log("key", itemKey);
    throw new Error(
      `No compare item found. Key: ${JSON.stringify(itemKey)}, Primary budget: ${budgetName}, Secondary budget ${secondBudgetName}`
    );
  }

  return {
    ...someItem,
    amount: (item?.amount ?? 0) - (secondItem?.amount ?? 0),
    primaryAmount: item?.amount ?? 0,
    secondaryAmount: secondItem?.amount ?? 0,
    children: children.map((child) => child.itemKey),
    maxChildrenAmount,
  };
};

export const convertItemWithChildrenAmountToItem = <D extends Dimension>(
  item?: ItemWithChildrenAmount<D>
): Item<D> | undefined => {
  if (!item) {
    return undefined;
  }
  return {
    ...item,
    children: item.children.map((child) => child.itemKey),
  };
};
