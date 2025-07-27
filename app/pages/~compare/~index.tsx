import { CompareItem } from "@/components/Compare/CompareItem";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/")({
  component: Page,
});

function Page() {
  return (
    <div className="mt-1 p-3">
      <div className="flex flex-col gap-2">
        <CompareItem />
        <CompareItem />
        <CompareItem />
      </div>
    </div>
  );
}
