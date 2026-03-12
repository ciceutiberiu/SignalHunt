import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { PLANS } from "@/lib/utils/constants";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const stripe = getStripe();
  let synced = 0;

  try {
    // Get all pro users with stripe subscription IDs
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, stripe_subscription_id")
      .not("stripe_subscription_id", "is", null);

    if (!profiles?.length) {
      return NextResponse.json({ message: "No subscriptions to sync" });
    }

    for (const profile of profiles) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id!
        );

        const isActive = ["active", "trialing"].includes(subscription.status);

        await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
            plan: isActive ? "pro" : "free",
            keyword_limit: isActive ? PLANS.pro.keywordLimit : PLANS.free.keywordLimit,
          })
          .eq("id", profile.id);

        synced++;
      } catch {
        // Subscription may have been deleted
        await supabase
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            keyword_limit: PLANS.free.keywordLimit,
          })
          .eq("id", profile.id);
      }
    }

    return NextResponse.json({ synced });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
