import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/published/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-4">
      <h1>Zveřejněné rozpočty občanů</h1>
    </div>
  );
}
