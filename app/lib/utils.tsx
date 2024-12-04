import type { DefaultError, UseQueryResult } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { type FC, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";
import lodash from "lodash";
const { isArray } = lodash;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function seo({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
}

export const withProviders =
  <P extends object>(...providers: Array<FC<PropsWithChildren>>) =>
  (WrappedComponent: FC<P>): FC<P> =>
  (props: P) =>
    providers.reduceRight(
      (acc, Provider) => {
        return <Provider>{acc}</Provider>;
      },
      <WrappedComponent {...props} />
    );

export const formatCurrency = new Intl.NumberFormat("cs-CZ", {
  style: "decimal",
  currency: "CZK",
  notation: "compact",
}).format;

export const formatPercent = new Intl.NumberFormat("cs-CZ", {
  style: "percent",
}).format;

export type SimpleQueryResult<TData = unknown, TError = DefaultError> = Pick<
  UseQueryResult<TData, TError>,
  "data" | "error" | "isPending" | "isFetching"
>;

export async function parseCsv<
  T extends Record<string, string | number> = Record<string, string | number>,
  A = Array<T>,
>(
  csvContent: string,
  filter?: (record: T) => boolean,
  reduce?: (record: T, acc?: A) => A,
  initAcc?: A
): Promise<A> {
  return new Promise<A>((resolve) => {
    let acc = reduce ? (initAcc as A) : ([] as A & Array<T>);

    Papa.parse<T>(csvContent, {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      step({ data: record }) {
        if (filter?.(record) ?? true) {
          if (reduce) {
            acc = reduce(record, acc);
          } else if (isArray(acc)) {
            acc.push(record);
          } else {
            throw new Error("Unexpected accumulator type");
          }
        }
      },
      complete() {
        if (!acc) {
          throw new Error("No csv records found");
        }
        resolve(acc);
      },
    });
  });
}

export type Optional<T> = {
  [K in keyof T]?: T[K];
};
