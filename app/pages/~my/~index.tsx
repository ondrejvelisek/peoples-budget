import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-4">
      <h1>Můj rozpočet</h1>
    </div>
  );
}
