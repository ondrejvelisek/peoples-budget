import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function SupportSuccessForm({
  className,
  onClose,
}: {
  className?: string;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 pt-6 text-center",
        className
      )}
    >
      <div className="rounded-full bg-lime-100 p-3 text-lime-600">
        <CheckCircle2 className="size-12" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-stone-900">
          Děkuju za podporu!
        </h2>
        <p className="text-stone-600">
          Vaše platba proběhla úspěšně.
          <br />
          Velmi si vaší pomoc vážím!
        </p>
      </div>
      <Button onClick={() => onClose()} className="w-full" size="lg">
        Zavřít
      </Button>
    </div>
  );
}
