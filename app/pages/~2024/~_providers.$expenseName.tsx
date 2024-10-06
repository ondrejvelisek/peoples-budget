import { createFileRoute } from "@tanstack/react-router";
import { ExpensesExplorer } from "@/components/ExpensesExplorer/ExpensesExplorer";
import { IncomeThumbnail } from "@/components/IncomeThumbnail/IncomeThumbnail";

export const Route = createFileRoute("/2024/_providers/$expenseName")({
  component: ExpensePage,
});

function ExpensePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <IncomeThumbnail className="" />
      <ExpensesExplorer className="grow overflow-y-auto rounded-t-2xl border-t-2 border-sand-500/10 p-1 pb-2 outline outline-4 outline-sand-500/5 md:p-3" />
    </div>
  );
}
