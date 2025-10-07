import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  accessChildrenExpenseDimension,
  isExpenseDimension,
  type ExpenseKey,
  type ExpensesSplatParam,
} from "@/data/expenses/expenseDimensions";
import { CompareExplorer } from "@/components/CompareExplorer/CompareExplorer";
import { compareExpenseQueryOptions } from "@/data/compare/compareExpense";
import { MySuspense } from "@/lib/utils";

export const Route = createFileRoute(
  "/compare/$budgetName/$secondBudgetName/vydaje/$"
)({
  component: ComparePage,
  params: {
    parse: ({
      _splat,
    }): {
      _splat: ExpensesSplatParam;
    } => {
      if (!_splat) {
        return {
          _splat: { expenseDimension: undefined, expenseKey: [] },
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

      return { _splat: { expenseDimension, expenseKey } };
    },
    stringify: ({ _splat: { expenseDimension, expenseKey } }) => ({
      _splat: `${expenseKey.map(({ dimension, id }) => `${dimension}/${id}`).join("/")}${expenseDimension ? `/${expenseDimension}` : ""}`,
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
        to: "/compare/$budgetName/$secondBudgetName/vydaje/$",
        params: {
          budgetName: params.budgetName,
          secondBudgetName: params.secondBudgetName,
          _splat: { expenseKey, expenseDimension: childrenDimension },
        },
      });
    }
    await context.queryClient
      .ensureQueryData(
        compareExpenseQueryOptions(
          params.budgetName,
          params.secondBudgetName,
          expenseKey,
          expenseDimension
        )
      )
      .then(async ({ children }) => {
        const ancestors =
          expenseKey.length > 0
            ? expenseKey.map((_, index) => expenseKey.slice(0, index))
            : [];

        [...ancestors, ...children].map(async (relativesKey) => {
          const childrenDimension = accessChildrenExpenseDimension(
            splat,
            relativesKey
          );
          context.queryClient.prefetchQuery(
            compareExpenseQueryOptions(
              params.budgetName,
              params.secondBudgetName,
              relativesKey,
              childrenDimension
            )
          );
        });
      });
  },
});

function ComparePage() {
  return (
    <MySuspense>
      <CompareExplorer className="pb-4" />
    </MySuspense>
  );
}
