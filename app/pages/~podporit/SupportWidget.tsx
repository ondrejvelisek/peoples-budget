import { cn } from "@/lib/utils";
import { SupportAmountForm } from "./SupportAmountForm";
import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent, stripeClient } from "./stripe";
import { SupportDialog } from "./SupportDialog";
import { Elements } from "@stripe/react-stripe-js";
import { SupportFailedForm } from "./SupportFailedForm";

export function SupportWidget({ className }: { className?: string }) {
  const {
    mutate: createPaymentIntentMutation,
    isPending,
    data: paymentIntentData,
    error: paymentIntentError,
    reset: resetPaymentIntent,
  } = useMutation({
    mutationFn: createPaymentIntent,
  });
  const amount = paymentIntentData?.amount ?? 100;

  const handleSubmit = (amount: number) => {
    createPaymentIntentMutation({ data: { amount } });
  };

  return (
    <div className={cn("", className)}>
      {!isPending && !!paymentIntentError ? (
        <SupportFailedForm
          error={paymentIntentError}
          onClose={resetPaymentIntent}
        />
      ) : (
        <SupportAmountForm onSubmit={handleSubmit} isPending={isPending} />
      )}

      <Elements
        options={{
          mode: "payment",
          amount: amount * 100,
          currency: "czk",
          appearance: {
            theme: "stripe",
            labels: "above",
            variables: {
              borderRadius: "12px",
              buttonBorderRadius: "12px",
            },
          },
          loader: "auto",
        }}
        stripe={stripeClient}
      >
        <SupportDialog
          open={!!paymentIntentData}
          onOpenChange={(isOpen) => (isOpen ? () => {} : resetPaymentIntent())}
          clientSecret={paymentIntentData?.clientSecret ?? undefined}
          amount={amount}
        />
      </Elements>
    </div>
  );
}
