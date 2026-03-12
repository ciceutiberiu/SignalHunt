import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, keyword_limit, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({
    plan: profile.plan,
    subscriptionStatus: profile.subscription_status,
    keywordLimit: profile.keyword_limit,
    hasStripeAccount: !!profile.stripe_customer_id,
  });
}
