import lodash from "lodash";
const { isEqual } = lodash;
import { parseCsv } from "@/lib/utils";
import { getRecordTables, type RecordTables } from "./recordTables";
import { kvStorage } from "./kvStorage";
import { createStorage, prefixStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import type { Dimension, ItemKey } from "./dimensions";

const itemsMemoryStorage = createStorage<Item<Dimension>>({
  driver: memoryDriver(),
});

const itemsStorage = import.meta.env.DEV
  ? itemsMemoryStorage
  : prefixStorage<Item<Dimension>>(kvStorage, "items:");

export type Item<D extends Dimension> = {
  key: ItemKey<D>;
  title: string;
  amount: number;
  children: Array<ItemKey<D>>;
  childrenDimension?: D;
  parent?: ItemKey<D>;
};

type DataRecord = {
  sector_id?: number; // income items does not have sector_id, but lazy to make it conditioanlly generic
  type_id: number;
  office_id: number;
  amount: number;
};

function reduceAmount<D extends Dimension>(record: DataRecord, acc?: Item<D>) {
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

type ItemKeyWithAmount<D extends Dimension> = ItemKey<D> & {
  amount: number;
};

type ItemWithChildrenAmount<D extends Dimension> = Omit<Item<D>, "children"> & {
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

  const child: ItemKeyWithAmount<D> = Object.assign(
    [...itemKey, { dimension, id }],
    { amount: record.amount }
  );

  const existingChild =
    acc &&
    acc.children.find((ch) =>
      ch.every((item, idx) => isEqual(item, child[idx]))
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
  type: "expense" | "income",
  csv: string,
  rootTitle: string,
  itemKey: ItemKey<D>,
  childrenDimension?: D
): Promise<Item<D>> => {
  const cacheKeyStr = JSON.stringify([type, itemKey, childrenDimension]);

  const memoryCached = await itemsMemoryStorage.getItem<Item<D>>(cacheKeyStr);
  if (memoryCached) {
    console.log("CACHE(getItem): memory HIT", cacheKeyStr);
    return memoryCached;
  }
  const cached = await itemsStorage.getItem<Item<D>>(cacheKeyStr);
  if (cached) {
    console.log("CACHE(getItem): HIT", cacheKeyStr);
    return cached;
  }
  console.log("CACHE(getItem): MISS", cacheKeyStr);

  const tables = await getRecordTables();

  function filter(record: DataRecord) {
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

  const item = await parseCsv<DataRecord, ItemWithChildrenAmount<D>>(
    csv,
    filter,
    reduce
  );

  item.children.sort((a, b) => b.amount - a.amount);

  await itemsMemoryStorage.setItem(cacheKeyStr, item);
  await itemsStorage.setItem(cacheKeyStr, item);
  return item;
};
