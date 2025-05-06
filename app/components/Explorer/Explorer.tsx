import {
  type ComponentType,
  type ReactNode,
  unstable_ViewTransition as ViewTransition,
} from "react";
import { cn } from "@/lib/utils";
import lodash from "lodash";
const { isEqual } = lodash;
import type { Dimension, ItemKey } from "@/data/dimensions";

export const ANIMATION_DURATION = 500;
export const ANIMATION_DURATION_CLASS = "";

export type ExplorerComponentProps<K extends ItemKey<Dimension>> = {
  itemKey: K;
  isParentFetching: boolean;
  className?: string;
};

type ExplorerProps<K extends ItemKey<Dimension>> = {
  itemKey: K;
  childrenKeys?: Array<K>;
  childrenDimension?: string;
  subjectKey: K;
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
  ExplorerComponent: ComponentType<ExplorerComponentProps<K>>;
  ExplorerItemComponent: ComponentType<{
    itemKey: K;
    relation: "parent" | "subject" | "child" | undefined;
    isLoading: boolean;
  }>;
};

export const Explorer = <K extends ItemKey<Dimension>>({
  itemKey,
  childrenKeys,
  childrenDimension,
  subjectKey,
  isLoading = false,
  isFetching = false,
  className,
  ExplorerComponent,
  ExplorerItemComponent,
}: ExplorerProps<K>): ReactNode => {
  const isSubject = isEqual(subjectKey, itemKey);
  const isParent = isEqual(subjectKey?.slice(0, -1), itemKey) && !isSubject;
  const isChild = isEqual(subjectKey, itemKey.slice(0, -1)) && !isSubject;

  const relation = isParent
    ? "parent"
    : isSubject
      ? "subject"
      : isChild
        ? "child"
        : undefined;

  return (
    <div
      style={{
        viewTransitionName: `item-${itemKey.map((segment) => `${segment.dimension}-${segment.id}`).join("-")}`,
        viewTransitionClass: `item`,
      }}
      className={cn(
        "overflow-hidden rounded-lg border-x border-b-2 border-neutral-600/10 border-b-neutral-600/20 outline outline-2 outline-stone-600/5 @container",
        ANIMATION_DURATION_CLASS,
        {
          "border-transparent outline-transparent rounded-xs border-x-0 border-b-0":
            relation !== "child",
          "mx-1": relation === "child",
        },
        className
      )}
    >
      {relation && (
        <div
          className="relative z-20"
          key={JSON.stringify(["header", itemKey])}
        >
          <ExplorerItemComponent
            itemKey={itemKey}
            relation={relation}
            isLoading={isLoading}
          />
        </div>
      )}
      <div className="relative z-10 grid">
        {(!isSubject || !isFetching) && !isLoading && childrenKeys && (
          <ul
            className={cn("col-start-1 row-start-1 flex flex-col bg-white")}
            key={JSON.stringify([childrenDimension, itemKey])}
          >
            {childrenKeys.map(
              (childKey) =>
                (isSubject ||
                  isEqual(childKey, subjectKey) ||
                  childKey.every((segment, index) =>
                    isEqual(segment, subjectKey?.[index])
                  )) && (
                  <li
                    className="relative overflow-hidden"
                    key={JSON.stringify(["child", childKey])}
                  >
                    <ExplorerComponent
                      itemKey={childKey}
                      isParentFetching={isFetching}
                      className={cn("mt-0", ANIMATION_DURATION_CLASS, {
                        "mt-3": isSubject,
                      })}
                    />
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
