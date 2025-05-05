import { type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import lodash from "lodash";
const { isEqual } = lodash;
import { motion, AnimatePresence } from "framer-motion";
import type { Dimension, ItemKey } from "@/data/dimensions";

export const ANIMATION_DURATION = 500;
export const ANIMATION_DURATION_CLASS = "duration-500";


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
              className={cn("col-start-1 row-start-1 flex flex-col bg-white")}
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
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
