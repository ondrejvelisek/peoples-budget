import { Field } from "@/components/ui/Field";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrencyStandard } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getDonationStats } from "./stripe";
import Skeleton from "react-loading-skeleton";

export const ANNUAL_COSTS = 122000;

export function DonationProgressWidget({ className }: { className?: string }) {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["donationStats"],
    queryFn: () => getDonationStats(),
    placeholderData: undefined,
  });
  const isLoading = isPending || isFetching;
  const totalDonatedAmount = data?.totalDonatedAmount ?? 0;
  const donorsCount = data?.donorsCount ?? 0;
  const remainingAmount = Math.max(0, ANNUAL_COSTS - totalDonatedAmount);

  // Calculate percentage
  const percentage = Math.min(
    100,
    Math.round((totalDonatedAmount / ANNUAL_COSTS) * 1000) / 10
  );

  return (
    <Field className={cn("", className)}>
      <Label htmlFor="support-progress" className="flex justify-between">
        <div className="text-lime-600">
          <span className="leading-tight">Vybráno</span>
          <br />
          <span className="text-lg font-bold leading-tight">
            {!isLoading ? (
              `${formatCurrencyStandard(totalDonatedAmount)} Kč`
            ) : (
              <Skeleton
                width={80}
                className="text-sand-100"
                baseColor="currentColor"
                highlightColor="#FFF9"
              />
            )}
          </span>
        </div>
        <div className="text-right text-sand-500">
          <span className="">Roční náklady</span>
          <br />
          <span className="text-lg font-bold leading-tight">
            {!isLoading ? (
              `${formatCurrencyStandard(ANNUAL_COSTS)} Kč`
            ) : (
              <Skeleton
                width={100}
                className="text-sand-100"
                baseColor="currentColor"
                highlightColor="#FFF9"
              />
            )}
          </span>
        </div>
      </Label>
      {!isLoading ? (
        <Progress
          indicatorsProps={[
            isLoading
              ? undefined
              : {
                  className:
                    "text-lime-500 border-b-2 border-l border-lime-600/80 rounded-l-md",
                  value: isLoading ? 0 : totalDonatedAmount,
                  description: "Lidé už přispěli dohromady",
                },
            {
              className: cn(
                "border-r border-t-2 border-sand-200 text-sand-100",
                isLoading ? "animate-pulse rounded-md" : "rounded-r-md"
              ),
              value: remainingAmount,
              description: "K pokrytí ročních nákladů zbývá",
            },
          ].filter((indicator) => indicator !== undefined)}
          className="h-4"
          id="support-progress"
        />
      ) : (
        <Skeleton
          className="block text-sand-100"
          containerClassName="h-4 block"
          baseColor="currentColor"
          highlightColor="#FFF9"
        />
      )}
      <Label htmlFor="support-progress" className="flex justify-between">
        <div className="text-sm">
          {!isLoading ? (
            <>
              <span className="font-bold">{donorsCount}</span> lidí přispělo
            </>
          ) : (
            <Skeleton
              width={100}
              className="text-sand-100"
              baseColor="currentColor"
              highlightColor="#FFF9"
            />
          )}
        </div>
        <div className="text-right text-stone-700">
          {!isLoading ? (
            <>
              <span className="font-bold">
                {percentage.toLocaleString("cs-CZ")}
              </span>{" "}
              % pokryto
            </>
          ) : (
            <Skeleton
              width={80}
              className="text-sand-100"
              baseColor="currentColor"
              highlightColor="#FFF9"
            />
          )}
        </div>
      </Label>
    </Field>
  );
}
