import { createFileRoute } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { IncomeThumbnail } from "@/components/IncomeThumbnail/IncomeThumbnail";
import { expenseQueryOptions, type ExpenseKey } from "@/data/expenses";
import { isDimension } from "@/lib/utils";

export const Route = createFileRoute("/2024/_providers/$")({
  component: ExpensePage,
  params: {
    parse: ({ _splat, ...rest }) => {
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
        if (!isDimension(expenseDimension)) {
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
              if (!dimension || !isDimension(dimension)) {
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
    const expenseKey = params._splat.expenseKey;

    const { children } = await context.queryClient.ensureQueryData(
      expenseQueryOptions(expenseKey)
    );
    const ancestors =
      expenseKey.length > 0
        ? expenseKey.map((_, index) => expenseKey.slice(0, index))
        : [];

    await Promise.all(
      [...ancestors, ...children].map((relativesKey) =>
        context.queryClient.ensureQueryData(expenseQueryOptions(relativesKey))
      )
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
