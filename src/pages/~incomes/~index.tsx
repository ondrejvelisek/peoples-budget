import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/incomes/")({
  component: IncomePage,
});

function IncomePage() {
  return (
    <div className="p-2">
      <h3>Income Page</h3>
    </div>
  );
}
