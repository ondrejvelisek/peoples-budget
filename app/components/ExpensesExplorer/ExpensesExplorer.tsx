import { type FC } from "react";
import { ExpenseItem } from "./ExpenseItem";
import { calcAmount, useExpense } from "@/data/expenses";
import { useParams } from "@tanstack/react-router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import _ from "lodash";

export const ANIMATION_DURATION = 400;
export const ANIMATION_DURATION_CLASS = "duration-300";

export const ExpensesExplorer: FC<{
  expenseName?: string;
  className?: string;
}> = ({ expenseName, className }) => {
  const { expenseName: urlExpenseName } = useParams({ strict: false });
  const [urlExpense, , urlAncestors] = useExpense(urlExpenseName);
  const [expense] = useExpense(expenseName);
  const [animateChildrenRef] = useAutoAnimate({ duration: ANIMATION_DURATION });
  const [animateHeaderRef] = useAutoAnimate({ duration: ANIMATION_DURATION });

  if (!urlExpense || !urlExpenseName) {
    return <div>Výdaj nenalezen</div>;
  }

  const isParent = urlAncestors.at(0) === expense.name;
  const isSubject = expense.name === urlExpenseName;

  const urlChildren =
    "children" in urlExpense ? urlExpense.children : undefined;

  const isChild = urlChildren?.some((child) => child.name === expense.name);

  const relation = isParent
    ? "parent"
    : isSubject
      ? "subject"
      : isChild
        ? "child"
        : undefined;

  const children = "children" in expense ? expense.children : undefined;

  return (
    <div
      ref={animateHeaderRef}
      className={cn(
        "overflow-hidden rounded-lg border-x border-b-2 border-neutral-600/10 border-b-neutral-600/20 outline outline-2 outline-stone-600/5 transition-all",
        ANIMATION_DURATION_CLASS,
        {
          "border-transparent outline-transparent rounded-xs border-x-0 border-b-0":
            relation !== "child",
          "mx-1": relation === "child",
        },
        className
      )}
    >
      {relation && <ExpenseItem name={expense.name} relation={relation} />}
      {children && (
        <ul ref={animateChildrenRef} className={cn("flex flex-col gap-3")}>
          {_.sortBy(children, (child) => -calcAmount(child)).map(
            (child) =>
              (isSubject ||
                child.name === urlExpenseName ||
                urlAncestors.includes(child.name)) && (
                <li key={child.name}>
                  <ExpensesExplorer expenseName={child.name} />
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
};
