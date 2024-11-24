import { type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import lodash from "lodash";
const { isEqual } = lodash;
import { motion, AnimatePresence } from "framer-motion";

export const ANIMATION_DURATION = 500;
export const ANIMATION_DURATION_CLASS = "duration-500";

export type ExplorerItemKey<T = unknown> = Array<T>;

export type ExplorerComponentProps<T = unknown> = {
  itemKey: ExplorerItemKey<T>;
  isParentFetching: boolean;
  className?: string;
};

type ExplorerProps<T = unknown> = {
  itemKey: ExplorerItemKey<T>;
  childrenKeys?: Array<ExplorerItemKey<T>>;
  childrenDimension?: string;
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
  childrenDimension,
  subjectKey,
  isLoading = false,
  isFetching = false,
  className,
  ExplorerComponent,
  ExplorerItemComponent,
}: ExplorerProps<T>): ReactNode => {
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
      <AnimatePresence>
        {relation && (
          <motion.div
            key={JSON.stringify(["header", itemKey])}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: ANIMATION_DURATION / 1000 }}
          >
            <ExplorerItemComponent
              itemKey={itemKey}
              relation={relation}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid">
        <AnimatePresence>
          {(!isSubject || !isFetching) && !isLoading && childrenKeys && (
            <motion.ul
              className={cn("flex flex-col row-start-1 col-start-1 bg-white")}
              initial={{ opacity: 0, scaleX: 0.95, y: 20 }}
              animate={{ opacity: 1, scaleX: 1, y: 0 }}
              exit={{ opacity: 0, scaleX: 0.95, y: 20 }}
              key={JSON.stringify([childrenDimension, itemKey])}
              transition={{ duration: ANIMATION_DURATION / 1000 }}
            >
              <AnimatePresence>
                {childrenKeys.map(
                  (childKey) =>
                    (isSubject ||
                      isEqual(childKey, subjectKey) ||
                      childKey.every((segment, index) =>
                        isEqual(segment, subjectKey?.[index])
                      )) && (
                      <motion.li
                        className="overflow-hidden"
                        key={JSON.stringify(["child", childKey])}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: ANIMATION_DURATION / 1000 }}
                      >
                        <ExplorerComponent
                          itemKey={childKey}
                          isParentFetching={isFetching}
                          className={cn(
                            "mt-0 transition-all",
                            ANIMATION_DURATION_CLASS,
                            {
                              "mt-3": isSubject,
                            }
                          )}
                        />
                      </motion.li>
                    )
                )}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
