import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  accessChildrenIncomeDimension,
  isIncomeDimension,
  type IncomeKey,
  type IncomeSplatParam,
} from "@/data/incomes/incomeDimensions";
import { MySuspense } from "@/lib/utils";
import { CompareIncomesExplorer } from "@/components/CompareIncomesExplorer/CompareIncomesExplorer";
import { compareIncomeQueryOptions } from "@/data/compare/compareIncome";

export const Route = createFileRoute(
  "/compare/$budgetName/$secondBudgetName/prijmy/$",
)({
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
  loaderDeps: ({ search }) => ({
    health: search.health,
  }),
  loader: async ({ context, params, deps }) => {
    const splat = params._splat;
    const incomeKey = splat.incomeKey;
    const incomeDimension = splat.incomeDimension;
    if (!incomeDimension) {
      const childrenDimension = accessChildrenIncomeDimension(splat, incomeKey);
      if (childrenDimension) {
        throw redirect({
          to: "/compare/$budgetName/$secondBudgetName/prijmy/$",
          params: {
            budgetName: params.budgetName,
            secondBudgetName: params.secondBudgetName,
            _splat: { incomeKey, incomeDimension: childrenDimension },
          },
        });
      }
    }

    context.queryClient
      .ensureQueryData(
        compareIncomeQueryOptions(
          params.budgetName,
          params.secondBudgetName,
          incomeKey,
          deps.health,
          incomeDimension,
        ),
      )
      .then(async ({ children }) => {
        const ancestors =
          incomeKey.length > 0
            ? incomeKey.map((_, index) => incomeKey.slice(0, index))
            : [];

        [...ancestors, ...children].map(async (relativesKey) => {
          const childrenDimension = accessChildrenIncomeDimension(
            splat,
            relativesKey,
          );
          context.queryClient.prefetchQuery(
            compareIncomeQueryOptions(
              params.budgetName,
              params.secondBudgetName,
              relativesKey,
              deps.health,
              childrenDimension,
            ),
          );
        });
      });
  },
});

function IncomePage() {
  return (
    <MySuspense>
      <CompareIncomesExplorer className="pb-4" />
    </MySuspense>
  );
}
