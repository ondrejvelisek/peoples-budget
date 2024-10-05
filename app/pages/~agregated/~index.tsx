import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agregated/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-4">
      <h1>Agregovaný rozpočet z lidu</h1>
    </div>
  );
}
