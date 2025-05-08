import { type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Dimension, ItemKey } from "@/data/dimensions";

export type ExplorerComponentProps = {
  className?: string;
};

type ExplorerProps<K extends ItemKey<Dimension>> = {
  subjectKey: K;
  parentKey?: K;
  childrenKeys?: Array<K>;
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
  className,
  ExplorerItemComponent,
}: ExplorerProps<K>): ReactNode => {
  return (
    <div className={cn("flex flex-col", className)}>
      {parentKey && (
        <ExplorerItemComponent itemKey={parentKey} relation="parent" />
      )}
      <ExplorerItemComponent itemKey={subjectKey} relation="subject" />
      <ul className="mx-3 flex flex-col gap-3">
        {childrenKeys &&
          childrenKeys.map((childKey) => (
            <li key={JSON.stringify(["child", childKey])}>
              <ExplorerItemComponent itemKey={childKey} relation="child" />
            </li>
          ))}
      </ul>
    </div>
  );
};
