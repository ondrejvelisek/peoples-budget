import { type ComponentType, type ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import lodash from "lodash";
const { isEqual } = lodash;

export const ANIMATION_DURATION = 1000;
export const ANIMATION_DURATION_CLASS = "duration-1000";

export type ExplorerItemKey<T = unknown> = Array<T>;

export type ExplorerComponentProps<T = unknown> = {
  itemKey: ExplorerItemKey<T>;
  isParentFetching: boolean;
  className?: string;
};

type ExplorerProps<T = unknown> = {
  itemKey: ExplorerItemKey<T>;
  childrenKeys?: Array<ExplorerItemKey<T>>;
  subjectKey: ExplorerItemKey<T>;
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
  ExplorerComponent: ComponentType<ExplorerComponentProps<T>>;
  ExplorerItemComponent: ComponentType<{
    itemKey: ExplorerItemKey<T>;
    relation: "parent" | "subject" | "child" | undefined;
    isLoading: boolean;
  }>;
};

export const Explorer = <T,>({
  itemKey,
  childrenKeys,
  subjectKey,
  isLoading = false,
  isFetching = false,
  className,
  ExplorerComponent,
  ExplorerItemComponent,
}: ExplorerProps<T>): ReactNode => {
  const [animateHeaderRef] = useAutoAnimate({ duration: ANIMATION_DURATION });
  const [animateChildrenRef] = useAutoAnimate({ duration: ANIMATION_DURATION });

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
      ref={animateHeaderRef}
      className={cn(
        "overflow-hidden rounded-lg border-x border-b-2 border-neutral-600/10 border-b-neutral-600/20 outline outline-2 outline-stone-600/5 transition-all @container",
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
        <ExplorerItemComponent
          key={JSON.stringify(itemKey)}
          itemKey={itemKey}
          relation={relation}
          isLoading={isLoading}
        />
      )}
      {!isLoading && childrenKeys && (
        <div key={JSON.stringify(["children", itemKey])}>
          <ul ref={animateChildrenRef} className={cn("flex flex-col gap-3")}>
            {childrenKeys.map(
              (childKey) =>
                (isSubject ||
                  isEqual(childKey, subjectKey) ||
                  childKey.every((segment, index) =>
                    isEqual(segment, subjectKey?.[index])
                  )) && (
                  <li key={JSON.stringify(childKey)}>
                    <ExplorerComponent
                      itemKey={childKey}
                      isParentFetching={isFetching}
                    />
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
