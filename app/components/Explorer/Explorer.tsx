import { type ComponentType, type ReactNode } from "react";
import { cn, MySuspense } from "@/lib/utils";
import type { Dimension, ItemKey } from "@/data/dimensions/personalDimensions";
import type { LinkProps } from "@tanstack/react-router";
import { DimensionSwitcher } from "./DimensionSwitcher";
import Skeleton from "react-loading-skeleton";

export type ExplorerComponentProps = {
  className?: string;
};

type ExplorerProps<K extends ItemKey<Dimension>> = {
  subjectKey: K;
  parentKey?: K;
  childrenKeys?: Array<K>;
  dimensionLinks?: Array<LinkProps>;
  currentDimension?: Dimension;
  isLoading?: boolean;
  className?: string;
  ExplorerItemComponent: ComponentType<{
    itemKey: K;
    relation: "parent" | "subject" | "child" | undefined;
  }>;
};

export const Explorer = <K extends ItemKey<Dimension>>({
  parentKey,
  subjectKey,
  childrenKeys,
  dimensionLinks,
  currentDimension,
  isLoading,
  className,
  ExplorerItemComponent,
}: ExplorerProps<K>): ReactNode => {
  return (
    <div className={cn("flex max-w-3xl flex-col", className)}>
      {parentKey && (
        <MySuspense>
          <ExplorerItemComponent itemKey={parentKey} relation="parent" />
        </MySuspense>
      )}
      <MySuspense>
        <ExplorerItemComponent itemKey={subjectKey} relation="subject" />
      </MySuspense>

      {dimensionLinks && (
        <div
          className="mx-3 flex justify-end pb-3"
          style={{
            viewTransitionName: `dim-switcher-${subjectKey.map((key) => `${key.dimension}-${key.id}`).join("-")}`,
            viewTransitionClass: `dim-switcher  subject`,
          }}
        >
          {isLoading ? (
            <Skeleton width="6em" className="h-9 align-top" />
          ) : (
            <DimensionSwitcher
              className="w-fit"
              dimensionLinks={dimensionLinks}
              currentDimension={currentDimension}
            />
          )}
        </div>
      )}
      <ul className="mx-3 flex flex-col gap-3">
        {childrenKeys &&
          childrenKeys.map((childKey) => (
            <li key={JSON.stringify(["child", childKey])}>
              <MySuspense>
                <ExplorerItemComponent itemKey={childKey} relation="child" />
              </MySuspense>
            </li>
          ))}
      </ul>
    </div>
  );
};
