import { PlanCard } from "@/components/billing/plan-card";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Simple, Honest Pricing
      </h1>
      <p className="text-center text-muted-foreground mb-12 text-lg">
        Start free, upgrade when you need more keywords.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/signup">
          <div className="card-hover h-full">
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
          </div>
        </Link>
        <Link href="/signup">
          <div className="card-hover h-full">
            <PlanCard
              name="Starter"
              price={9}
              features={[
                "5 keywords to track",
                "AI intent scoring",
                "Full dashboard & filters",
                "5-minute updates",
                "Save & track signals",
              ]}
            />
          </div>
        </Link>
        <Link href="/signup">
          <div className="card-hover h-full">
            <PlanCard
              name="Pro"
              price={19}
              isPopular
              features={[
                "25 keywords to track",
                "AI intent scoring",
                "Full dashboard & filters",
                "5-minute updates",
                "Save & track signals",
                "Notes & status tracking",
                "Priority support",
              ]}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
