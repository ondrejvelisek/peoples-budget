import { type FC } from "react";
import { ExpenseItem } from "./ExpenseItem";
import { useExpense, type ExpenseKey } from "@/data/expenses";
import { useParams } from "@tanstack/react-router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils";
import { isEqual } from "lodash";

export const ANIMATION_DURATION = 400;
export const ANIMATION_DURATION_CLASS = "duration-300";

export const ExpensesExplorer: FC<{
  expenseKey?: ExpenseKey;
  className?: string;
}> = ({ expenseKey, className }) => {
  const urlExpenseKey = useParams({ strict: false })._splat?.expenseKey;
  const { data: urlExpense } = useExpense(urlExpenseKey);
  const { data: expense } = useExpense(expenseKey);
  const [animateChildrenRef] = useAutoAnimate({ duration: ANIMATION_DURATION });
  const [animateHeaderRef] = useAutoAnimate({ duration: ANIMATION_DURATION });

  if (!urlExpense || !urlExpenseKey || !expense) {
    return <div>Výdaj nenalezen</div>; // TODO add loading and error
  }

  const isSubject = isEqual(urlExpenseKey, expense.key);
  const isParent = isEqual(urlExpense.parent, expense.key);
  const isChild = urlExpense.children?.some((childKey) =>
    isEqual(childKey, expense.key)
  );

  const relation = isParent
    ? "parent"
    : isSubject
      ? "subject"
      : isChild
        ? "child"
        : undefined;

  return (
    <div
      ref={relation ? animateHeaderRef : undefined}
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
      {relation && <ExpenseItem expenseKey={expense.key} relation={relation} />}
      {expense.children && (
        <ul
          ref={relation ? animateChildrenRef : undefined}
          className={cn("flex flex-col gap-3")}
        >
          {expense.children.map(
            (childKey) =>
              (isSubject ||
                isEqual(childKey, urlExpenseKey) ||
                childKey.every((segment, index) =>
                  isEqual(segment, urlExpenseKey[index])
                )) && (
                <li
                  key={childKey
                    .map(({ dimension, id }) => `${dimension}/${id}`)
                    .join("/")}
                >
                  <ExpensesExplorer expenseKey={childKey} />
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
};
