import { clsx, type ClassValue } from "clsx";
import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

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
  style: "currency",
  currency: "CZK",
  notation: "compact",
}).format;

export const formatPercent = new Intl.NumberFormat("cs-CZ", {
  style: "percent",
}).format;
