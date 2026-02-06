import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function SupportFailedForm({
  className,
  error,
  onClose,
}: {
  error?: unknown;
  className?: string;
  onClose?: () => void;
}) {
  const errorMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 pt-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="size-12" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-stone-900">
          Platba se nezdařila
        </h2>
        <p className="text-sm text-stone-500">{errorMessage}</p>
        <p className="text-sm text-stone-500">
          Zkuste&nbsp;to&nbsp;prosím&nbsp;znovu
          nebo&nbsp;použijte&nbsp;jinou&nbsp;platební&nbsp;metodu.
        </p>
      </div>
      {onClose && (
        <Button onClick={onClose} className="mt-4 w-full" variant="outline">
          Zkusit znovu
        </Button>
      )}
    </div>
  );
}
