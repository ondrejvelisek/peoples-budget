import { createFileRoute, redirect } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { IncomeThumbnail } from "@/components/IncomeThumbnail/IncomeThumbnail";
import { expenseQueryOptions } from "@/data/expenses/expenses";
import {
  accessChildrenExpenseDimension,
  isExpenseDimension,
  type ExpenseKey,
  type ExpensesSplatParam,
} from "@/data/expenses/expenseDimensions";

export const Route = createFileRoute("/2024/vydaje/$")({
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
          throw new Error(`Invalid dimension: ${expenseDimension}`);
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
        to: "/2024/vydaje/$",
        params: {
          _splat: { expenseKey, expenseDimension: childrenDimension },
        },
      });
    }
    const { children } = await context.queryClient.ensureQueryData(
      expenseQueryOptions(expenseKey, expenseDimension)
    );

    const ancestors =
      expenseKey.length > 0
        ? expenseKey.map((_, index) => expenseKey.slice(0, index))
        : [];

    await Promise.all(
      [...ancestors, ...children].map(async (relativesKey) => {
        const childrenDimension = accessChildrenExpenseDimension(
          splat,
          relativesKey
        );
        return await context.queryClient.ensureQueryData(
          expenseQueryOptions(relativesKey, childrenDimension)
        );
      })
    );
  },
});

function ExpensePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <IncomeThumbnail className="" />
      <ExpensesExplorer className="grow overflow-y-auto rounded-t-2xl border-t-2 border-sand-500/10 p-1 pb-2 outline outline-4 outline-sand-500/5 md:p-3" />
    </div>
  );
}