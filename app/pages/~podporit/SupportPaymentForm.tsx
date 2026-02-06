import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { cn, formatCurrencyStandard } from "@/lib/utils";
import { PaymentElement } from "@stripe/react-stripe-js";

export function SupportPaymentForm({
  amount,
  className,
  onSubmit,
  isPending,
}: {
  amount: number;
  className?: string;
  onSubmit: () => void;
  isPending: boolean;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-2", className)}
    >
      <h3>Vyberte způsob platby</h3>
      <PaymentElement
        id="payment-element"
        className=""
        options={{
          layout: "accordion",
          readOnly: isPending,
        }}
      />
      <DialogFooter>
        <Button
          disabled={isPending}
          id="submit"
          type="submit"
          size="lg"
          className="w-full"
        >
          <span id="button-text">
            {isPending
              ? `Provádím platbu...`
              : `Přispět ${formatCurrencyStandard(amount)} Kč`}
          </span>
        </Button>
      </DialogFooter>
    </form>
  );
}
