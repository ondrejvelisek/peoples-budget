import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-4">
      <h1>Můj rozpočet</h1>
    </div>
  );
}
