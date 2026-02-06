import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function SupportPendingForm({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-8 text-center",
        className
      )}
    >
      <div className="rounded-full bg-orange-50 p-3 text-orange-600">
        <ExternalLink className="size-12 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-stone-900">Potvrďte platbu</h2>
        <p className="text-stone-500">
          Pro dokončení prosím potvrďte platbu v aplikaci vaší banky.
        </p>
        <p className="text-stone-500">
          Tato stránka se automaticky aktualizuje.
        </p>
      </div>
    </div>
  );
}
