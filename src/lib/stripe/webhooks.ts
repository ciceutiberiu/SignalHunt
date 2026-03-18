import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, PlanKey } from "@/lib/utils/constants";
import { sendWelcomeInviteEmail } from "@/lib/email/resend";

const PRICE_TO_PLAN: Record<string, PlanKey> = {
  [process.env.STRIPE_STARTER_PRICE_ID!]: "starter",
  [process.env.STRIPE_PRO_PRICE_ID!]: "pro",
};

function resolvePlanFromPriceId(priceId: string): PlanKey {
  return PRICE_TO_PLAN[priceId] || "pro";
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const metadataPlan = session.metadata?.plan as PlanKey | undefined;
  const plan: PlanKey = metadataPlan && metadataPlan in PLANS ? metadataPlan : "pro";

  const userId = session.metadata?.user_id;

  if (userId) {
    // Existing user upgrading from billing page
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
    return;
  }

  // Stripe-first checkout (no auth) — create or upgrade user
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    throw new Error("No customer email in checkout session");
  }

  const appUrl = process.env.APP_URL || "https://signal-hunt-fawn.vercel.app";

  // Check if user already exists
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const existingUser = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
  );

  let targetUserId: string;

  if (existingUser) {
    // Existing user — just upgrade their plan
    targetUserId = existingUser.id;
  } else {
    // Create user via admin API (trigger creates profile)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      email_confirm: true,
    });

    if (createError || !newUser.user) {
      throw new Error(`Failed to create user: ${createError?.message || "no user returned"}`);
    }

    targetUserId = newUser.user.id;

    // Wait for the DB trigger to create the profile row
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Ensure profile exists (upsert in case trigger didn't fire)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", targetUserId)
    .single();

  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: targetUserId,
      email: customerEmail,
      display_name: customerEmail.split("@")[0],
      plan,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      subscription_status: "active",
      keyword_limit: PLANS[plan].keywordLimit,
    });
    if (insertError) {
      throw new Error(`Failed to insert profile: ${insertError.message}`);
    }
  } else {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        subscription_status: "active",
        keyword_limit: PLANS[plan].keywordLimit,
      })
      .eq("id", targetUserId);
    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
  }

  // Send branded welcome email via Resend for new users
  if (!existingUser) {
    // Use recovery link so user can set their password on first login
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: customerEmail,
      options: {
        redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      throw new Error(`Failed to generate link: ${linkError?.message || "no link returned"}`);
    }

    const { error: emailError } = await sendWelcomeInviteEmail(
      customerEmail,
      linkData.properties.action_link,
      plan,
    );

    if (emailError) {
      throw new Error(`Failed to send email via Resend: ${JSON.stringify(emailError)}`);
    }
  }
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
