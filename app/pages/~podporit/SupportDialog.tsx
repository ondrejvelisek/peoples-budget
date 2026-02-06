import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SupportPaymentForm } from "./SupportPaymentForm";
import { SupportFailedForm } from "./SupportFailedForm";
import { SupportSuccessForm } from "./SupportSuccessForm";
import { Route } from "./~index";
import { SupportPendingForm } from "./SupportPendingForm";

export function SupportDialog({
  defaultOpen,
  onOpenChange,
  open,
  className,
  clientSecret: clientSecretProp,
  amount,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  open?: boolean;
  className?: string;
  clientSecret?: string;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { redirect_status, payment_intent_client_secret } = Route.useSearch();
  const navigate = useNavigate();

  const clientSecret = clientSecretProp || payment_intent_client_secret;

  const { data: polledPaymentIntent } = useQuery({
    queryKey: ["paymentIntent", clientSecret],
    queryFn: async () => {
      if (!stripe || !clientSecret) return null;
      const { paymentIntent } =
        await stripe.retrievePaymentIntent(clientSecret);
      return paymentIntent;
    },
    enabled:
      !!stripe &&
      !!clientSecret &&
      !!redirect_status &&
      !["succeeded", "failed", "canceled"].includes(redirect_status),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && ["succeeded", "failed", "canceled"].includes(status)) {
        return false;
      }
      return 2000;
    },
  });

  const currentStatus = polledPaymentIntent?.status || redirect_status;

  const {
    mutate: confirmPayment,
    isPending,
    data: confirmPaymentData,
    error: confirmPaymentError,
    reset,
  } = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements || !clientSecret) {
        throw new Error("Stripe or elements not loaded");
      }
      const result = await elements.submit();
      if (result.error) {
        throw result.error;
      }
      const confirmResult = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: location.url,
        },
        redirect: "if_required",
      });
      return confirmResult;
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isPending) {
      return;
    }

    const isClosingWithSuccess =
      !isOpen &&
      (currentStatus === "succeeded" ||
        (!!confirmPaymentData &&
          !confirmPaymentError &&
          !confirmPaymentData?.error));

    if (isClosingWithSuccess) {
      queryClient.invalidateQueries({ queryKey: ["donationStats"] });
    }

    if (!isOpen) {
      reset();
      navigate({ to: ".", search: { succeeded: isClosingWithSuccess } }); // remove search query params from payment redirect flow
    }
    onOpenChange?.(isOpen);
  };

  return (
    <Dialog
      open={
        open ||
        !!confirmPaymentData ||
        !!confirmPaymentError ||
        redirect_status !== undefined
      }
      onOpenChange={handleOpenChange}
      defaultOpen={defaultOpen}
    >
      <DialogContent
        className={cn("sm:max-w-sm", className)}
        overlayClassName="bg-stone-200/80"
      >
        {!isPending &&
        !!confirmPaymentError &&
        "type" in confirmPaymentError &&
        confirmPaymentError?.type !== "validation_error" ? (
          <SupportFailedForm
            error={confirmPaymentError}
            onClose={() => reset()}
          />
        ) : !isPending && !!confirmPaymentData?.error ? (
          <SupportFailedForm
            error={confirmPaymentData?.error}
            onClose={() => reset()}
          />
        ) : currentStatus === "failed" || currentStatus === "canceled" ? (
          <SupportFailedForm
            error={confirmPaymentData?.error}
            onClose={() => {
              reset();
              navigate({ to: "." });
            }}
          />
        ) : currentStatus === "processing" || currentStatus === "pending" ? (
          <SupportPendingForm />
        ) : currentStatus === "succeeded" ? (
          <SupportSuccessForm
            onClose={() => {
              handleOpenChange(false);
            }}
          />
        ) : !isPending && !!confirmPaymentData?.paymentIntent ? (
          <SupportSuccessForm onClose={() => handleOpenChange(false)} />
        ) : (
          <SupportPaymentForm
            amount={amount}
            onSubmit={() => confirmPayment()}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
