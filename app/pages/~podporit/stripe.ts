import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4/mini";
import createServerStripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

const serverStripe = new createServerStripe(process.env.STRIPE_SECRET_KEY);

export const stripeClient = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export const createPaymentIntent = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      amount: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const paymentIntent = await serverStripe.paymentIntents.create({
      amount: data.amount * 100,
      currency: "czk",
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: data.amount,
    };
  });

export const getDonationStats = createServerFn({
  method: "GET",
}).handler(async () => {
  const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;

  // Using list() instead of search() for better real-time consistency
  let donations: createServerStripe.PaymentIntent[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const params: createServerStripe.PaymentIntentListParams = {
      created: { gt: oneYearAgo },
      limit: 100,
      starting_after: startingAfter,
    };

    const result = await serverStripe.paymentIntents.list(params);

    // Filter for succeeded payments only
    const succeededPayments = result.data.filter(
      (pi) => pi.status === "succeeded"
    );
    donations = [...donations, ...succeededPayments];

    hasMore = result.has_more;
    const lastItem = result.data[result.data.length - 1];
    if (hasMore && lastItem) {
      startingAfter = lastItem.id;
    } else {
      hasMore = false;
    }
  }

  const totalAmountCents = donations.reduce((sum, pi) => sum + pi.amount, 0);
  const totalDonatedAmount = totalAmountCents / 100;
  const donorsCount = donations.length;

  return {
    totalDonatedAmount,
    donorsCount,
  };
});
