import { CompareItem } from "@/components/Compare/CompareItem";
import { useCompare } from "@/data/compare/compare";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/")({
  component: Page,
});

function Page() {
  const { data, isPending, isFetching, error } = useCompare();

  if (isPending || isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="mt-1 p-3">
      <div className="flex flex-col gap-2">
        {data.map((compareItem) => (
          <CompareItem
            key={`${compareItem.sectorId}-${compareItem.typeId}-${compareItem.officeId}`}
            compareItem={compareItem}
          />
        ))}
      </div>
    </div>
  );
}
