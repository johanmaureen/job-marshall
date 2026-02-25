import Stripe from "stripe";

export const stripe = new Stripe(process.env.SECRET_STRIPE_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});
