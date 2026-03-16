import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, PlanKey } from "@/lib/utils/constants";

const PRICE_TO_PLAN: Record<string, PlanKey> = {
  [process.env.STRIPE_STARTER_PRICE_ID!]: "starter",
  [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
};

function resolvePlanFromPriceId(priceId: string): PlanKey {
  return PRICE_TO_PLAN[priceId] || "pro";
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;
  if (!userId) return;

  // Prefer metadata, fall back to price ID lookup
  const metadataPlan = session.metadata?.plan as PlanKey | undefined;
  const plan: PlanKey = metadataPlan && metadataPlan in PLANS ? metadataPlan : "pro";

  await supabase
    .from("profiles")
    .update({
      plan,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: "active",
      keyword_limit: PLANS[plan].keywordLimit,
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

  let plan: PlanKey = "free";
  if (isActive && subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id;
    plan = resolvePlanFromPriceId(priceId);
  }

  await supabase
    .from("profiles")
    .update({
      subscription_status: subscription.status,
      plan,
      keyword_limit: PLANS[plan].keywordLimit,
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
