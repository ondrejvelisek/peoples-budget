import { createFileRoute, redirect } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { expenseQueryOptions } from "@/data/expenses/expenses";
import {
  accessChildrenExpenseDimension,
  isExpenseDimension,
  type ExpenseKey,
  type ExpensesSplatParam,
} from "@/data/expenses/expenseDimensions";
import { MySuspense } from "@/lib/utils";

export const Route = createFileRoute("/vladni/$budgetName/vydaje/$")({
  component: ExpensePage,
  params: {
    parse: ({ _splat, ...rest }): { _splat: ExpensesSplatParam } => {
      if (!_splat) {
        return {
          _splat: { expenseDimension: undefined, expenseKey: [] },
          ...rest,
        };
      }
      const splatSegments = _splat.split("/");
      const hasDimension = splatSegments?.length % 2 === 1;
      let expenseDimension = undefined;
      if (hasDimension) {
        expenseDimension = splatSegments?.at(-1);
        if (!isExpenseDimension(expenseDimension)) {
          throw new Error(`Invalid dimension D: ${expenseDimension}`);
        }
      }
      const expenseKey =
        splatSegments
          ?.slice(0, hasDimension ? -1 : undefined)
          .reduce((acc, _, index, arr) => {
            if (index % 2 === 0) {
              const dimension = arr[index];
              const id = arr[index + 1];
              if (!dimension || !isExpenseDimension(dimension)) {
                throw new Error(`Invalid expense dimension: ${dimension}`);
              }
              if (!id) {
                throw new Error(`Invalid expense id: ${id}`);
              }
              acc.push({ dimension, id });
            }
            return acc;
          }, [] as ExpenseKey) ?? [];

      return { _splat: { expenseDimension, expenseKey }, ...rest };
    },
    stringify: ({ _splat: { expenseDimension, expenseKey }, ...rest }) => ({
      _splat: `${expenseKey.map(({ dimension, id }) => `${dimension}/${id}`).join("/")}${expenseDimension ? `/${expenseDimension}` : ""}`,
      ...rest,
    }),
  },
  loader: async ({ context, params }) => {
    const splat = params._splat;
    const expenseKey = splat.expenseKey;
    const expenseDimension = splat.expenseDimension;
    if (!expenseDimension) {
      const childrenDimension = accessChildrenExpenseDimension(
        splat,
        expenseKey
      );
      if (!childrenDimension) {
        throw new Error(`No children dimension found for ${expenseKey}`);
      }
      throw redirect({
        to: "/vladni/$budgetName/vydaje/$",
        params: {
          budgetName: params.budgetName,
          _splat: { expenseKey, expenseDimension: childrenDimension },
        },
      });
    }
    context.queryClient
      .ensureQueryData(
        expenseQueryOptions(params.budgetName, expenseKey, expenseDimension)
      )
      .then(({ children }) => {
        const ancestors =
          expenseKey.length > 0
            ? expenseKey.map((_, index) => expenseKey.slice(0, index))
            : [];

        [...ancestors, ...children].map((relativesKey) => {
          const childrenDimension = accessChildrenExpenseDimension(
            splat,
            relativesKey
          );
          context.queryClient.prefetchQuery(
            expenseQueryOptions(
              params.budgetName,
              relativesKey,
              childrenDimension
            )
          );
        });
      });
  },
});

function ExpensePage() {
  return (
    <MySuspense>
      <ExpensesExplorer className="pb-4" />
    </MySuspense>
  );
}
