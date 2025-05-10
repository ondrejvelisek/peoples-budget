import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  accessChildrenIncomeDimension,
  isIncomeDimension,
  type IncomeKey,
  type IncomeSplatParam,
} from "@/data/incomes/incomeDimensions";
import { incomeQueryOptions } from "@/data/incomes/incomes";
import { IncomesExplorer } from "@/components/IncomesExplorer/IncomesExplorer";

export const Route = createFileRoute("/vladni/$budgetName/prijmy/$")({
  component: IncomePage,
  params: {
    parse: ({ _splat, ...rest }): { _splat: IncomeSplatParam } => {
      if (!_splat) {
        return {
          _splat: { incomeDimension: undefined, incomeKey: [] },
          ...rest,
        };
      }
      const splatSegments = _splat.split("/");
      const hasDimension = splatSegments?.length % 2 === 1;
      let incomeDimension = undefined;
      if (hasDimension) {
        incomeDimension = splatSegments?.at(-1);
        if (!isIncomeDimension(incomeDimension)) {
          throw new Error(`Invalid dimension C: ${incomeDimension}`);
        }
      }
      const incomeKey =
        splatSegments
          ?.slice(0, hasDimension ? -1 : undefined)
          .reduce((acc, _, index, arr) => {
            if (index % 2 === 0) {
              const dimension = arr[index];
              const id = arr[index + 1];
              if (!dimension || !isIncomeDimension(dimension)) {
                throw new Error(`Invalid income dimension: ${dimension}`);
              }
              if (!id) {
                throw new Error(`Invalid income id: ${id}`);
              }
              acc.push({ dimension, id });
            }
            return acc;
          }, [] as IncomeKey) ?? [];

      return { _splat: { incomeDimension, incomeKey }, ...rest };
    },
    stringify: ({ _splat: { incomeDimension, incomeKey }, ...rest }) => ({
      _splat: `${incomeKey.map(({ dimension, id }) => `${dimension}/${id}`).join("/")}${incomeDimension ? `/${incomeDimension}` : ""}`,
      ...rest,
    }),
  },
  loader: async ({ context, params }) => {
    const splat = params._splat;
    const incomeKey = splat.incomeKey;
    const incomeDimension = splat.incomeDimension;
    if (!incomeDimension) {
      const childrenDimension = accessChildrenIncomeDimension(splat, incomeKey);
      if (!childrenDimension) {
        throw new Error(`No children dimension found for ${incomeKey}`);
      }
      throw redirect({
        to: "/vladni/$budgetName/prijmy/$",
        params: {
          budgetName: params.budgetName,
          _splat: {
            incomeKey,
            incomeDimension: childrenDimension,
          },
        },
      });
    }
    const { children } = await context.queryClient.ensureQueryData(
      incomeQueryOptions(params.budgetName, incomeKey, incomeDimension)
    );

    const ancestors =
      incomeKey.length > 0
        ? incomeKey.map((_, index) => incomeKey.slice(0, index))
        : [];

    await Promise.all(
      [...ancestors, ...children].map(async (relativesKey) => {
        const childrenDimension = accessChildrenIncomeDimension(
          splat,
          relativesKey
        );
        return await context.queryClient.ensureQueryData(
          incomeQueryOptions(params.budgetName, relativesKey, childrenDimension)
        );
      })
    );
  },
});

function IncomePage() {
  return <IncomesExplorer className="pb-4" />;
}
