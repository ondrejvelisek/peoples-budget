import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-4">
      <h1>O projektu</h1>
    </div>
  );
}
