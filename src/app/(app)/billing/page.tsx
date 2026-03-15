"use client";

import { Suspense, useEffect, useState } from "react";
import { PlanCard } from "@/components/billing/plan-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";

interface BillingStatus {
  plan: string;
  subscriptionStatus: string | null;
  keywordLimit: number;
  hasStripeAccount: boolean;
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><h1 className="text-2xl font-bold">Billing</h1><div className="animate-pulse h-48 bg-gray-100 rounded-lg" /></div>}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Upgrade successful! Welcome to Pro." });
    }
    if (searchParams.get("canceled") === "true") {
      toast({ title: "Checkout canceled", variant: "destructive" });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((r) => r.json())
      .then(setBilling)
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    const res = await fetch("/api/billing/create-checkout", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      toast({ title: "Failed to start checkout", variant: "destructive" });
    }
  };

  const handlePortal = async () => {
    const res = await fetch("/api/billing/create-portal", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      toast({ title: "Failed to open billing portal", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Billing</h1>
        <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  const isPaid = billing?.plan === "starter" || billing?.plan === "pro";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription</p>
      </div>

      {billing && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold capitalize">{billing.plan} Plan</span>
              {billing.subscriptionStatus && (
                <span className="text-sm text-muted-foreground">
                  Status: {billing.subscriptionStatus}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Keyword limit: {billing.keywordLimit}
            </p>
            {!isPaid ? (
              <Button onClick={handleCheckout}>Upgrade Now</Button>
            ) : (
              <Button variant="outline" onClick={handlePortal}>
                Manage Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
        <PlanCard
          name="Free"
          price={0}
          isCurrent={billing?.plan === "free"}
          features={[
            "1 keyword to track",
            "AI intent scoring",
            "Basic dashboard",
            "5-minute updates",
          ]}
        />
        <PlanCard
          name="Starter"
          price={9}
          isCurrent={billing?.plan === "starter"}
          features={[
            "5 keywords to track",
            "AI intent scoring",
            "Full dashboard & filters",
            "5-minute updates",
            "Save & track signals",
          ]}
          onSelect={billing?.plan === "free" ? handleCheckout : undefined}
          buttonLabel="Upgrade to Starter"
        />
        <PlanCard
          name="Pro"
          price={19}
          isPopular
          isCurrent={billing?.plan === "pro"}
          features={[
            "25 keywords to track",
            "AI intent scoring",
            "Full dashboard & filters",
            "5-minute updates",
            "Save & track signals",
            "Notes & status tracking",
            "Priority support",
          ]}
          onSelect={!isPaid || billing?.plan === "starter" ? handleCheckout : undefined}
          buttonLabel="Upgrade to Pro"
        />
      </div>
    </div>
  );
}
