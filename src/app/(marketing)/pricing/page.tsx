import { PlanCard } from "@/components/billing/plan-card";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-muted-foreground mb-12">
        Start free, upgrade when you need more keywords.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link href="/signup">
          <PlanCard
            name="Free"
            price={0}
            features={[
              "1 keyword to track",
              "AI intent scoring",
              "Basic dashboard",
              "5-minute updates",
            ]}
          />
        </Link>
        <Link href="/signup">
          <PlanCard
            name="Pro"
            price={29}
            isPopular
            features={[
              "Up to 50 keywords",
              "AI intent scoring",
              "Full dashboard & filters",
              "5-minute updates",
              "Save & track signals",
              "Notes & status tracking",
              "Priority support",
            ]}
          />
        </Link>
      </div>
    </div>
  );
}
