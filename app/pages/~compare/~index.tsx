import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compare/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-4">
      <h1>Porovnání rozpočtů</h1>
    </div>
  );
}
