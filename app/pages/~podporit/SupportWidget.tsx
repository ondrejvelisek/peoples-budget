import { cn } from "@/lib/utils";
import { SupportAmountForm } from "./SupportAmountForm";
import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent, stripeClient } from "./stripe";
import { SupportDialog } from "./SupportDialog";
import { Elements } from "@stripe/react-stripe-js";
import { SupportFailedForm } from "./SupportFailedForm";
import { Route } from "./~index";
import { SupportSuccessForm } from "./SupportSuccessForm";
import { useNavigate } from "@tanstack/react-router";

export function SupportWidget({ className }: { className?: string }) {
  const { succeeded } = Route.useSearch();
  const navigate = useNavigate();
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
      {!isPending && succeeded ? (
        <SupportSuccessForm closeButtonText="Přispět znovu" onClose={() => {
          navigate({ to: ".", search: { succeeded: undefined } });
        }} />
      ) : !isPending && !!paymentIntentError ? (
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
