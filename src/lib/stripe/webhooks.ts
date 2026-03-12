import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/lib/utils/constants";

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;
  if (!userId) return;

  await supabase
    .from("profiles")
    .update({
      plan: "pro",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: "active",
      keyword_limit: PLANS.pro.keywordLimit,
    })
    .eq("id", userId);
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .limit(1);

  if (!profiles?.length) return;

  const isActive = ["active", "trialing"].includes(subscription.status);

  await supabase
    .from("profiles")
    .update({
      subscription_status: subscription.status,
      plan: isActive ? "pro" : "free",
      keyword_limit: isActive ? PLANS.pro.keywordLimit : PLANS.free.keywordLimit,
    })
    .eq("id", profiles[0].id);
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();

  await supabase
    .from("profiles")
    .update({
      plan: "free",
      subscription_status: "canceled",
      keyword_limit: PLANS.free.keywordLimit,
    })
    .eq("stripe_subscription_id", subscription.id);
}
