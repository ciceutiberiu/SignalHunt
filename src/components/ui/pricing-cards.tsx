"use client";

import { useState } from "react";
import { Check, MoveRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PricingFeature {
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: number;
  plan: "starter" | "pro";
  description: string;
  features: PricingFeature[];
  buttonLabel: string;
  buttonVariant?: "default" | "outline";
  isPopular?: boolean;
}

interface PricingProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 9,
    plan: "starter",
    description:
      "For indie hackers and solo founders ready to find leads and grow faster.",
    features: [
      {
        title: "5 keywords to track",
        description: "Cast a wider net across Reddit communities.",
      },
      {
        title: "AI intent scoring",
        description: "Claude AI scores every post for real buying intent.",
      },
      {
        title: "Full dashboard & filters",
        description: "Filter by intent, keyword, subreddit, and status.",
      },
      {
        title: "Save & track signals",
        description: "Bookmark leads and track your outreach progress.",
      },
    ],
    buttonLabel: "Get Started",
    buttonVariant: "default",
    isPopular: true,
  },
  {
    name: "Pro",
    price: 19,
    plan: "pro",
    description:
      "For growing teams and agencies who need maximum coverage and lead volume.",
    features: [
      {
        title: "25 keywords to track",
        description: "Monitor your full product and competitor landscape.",
      },
      {
        title: "Subreddit targeting",
        description: "Focus on specific communities for higher signal quality.",
      },
      {
        title: "Notes & status tracking",
        description: "Add notes, mark as contacted, and manage your pipeline.",
      },
      {
        title: "Priority support",
        description: "Get help fast when you need it.",
      },
    ],
    buttonLabel: "Get Started",
    buttonVariant: "outline",
  },
];

function Pricing({
  badge = "Pricing",
  title = "Simple, honest pricing",
  subtitle = "Pick a plan. Start hunting in minutes. Cancel anytime.",
  tiers = defaultTiers,
}: PricingProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/billing/create-checkout-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="w-full py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge>{badge}</Badge>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              {title}
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              {subtitle}
            </p>
          </div>
          <div className="grid pt-16 text-left grid-cols-1 lg:grid-cols-2 w-full gap-8 max-w-3xl">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card
                  className={`w-full rounded-xl h-full flex flex-col transition-all duration-300 hover:translate-y-[-4px] ${
                    tier.isPopular
                      ? "shadow-2xl border-primary/30 relative"
                      : "hover:shadow-lg"
                  }`}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-md">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>
                      <span className="flex flex-row gap-4 items-center font-normal">
                        {tier.name}
                      </span>
                    </CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex flex-col gap-8 justify-start flex-1">
                      <p className="flex flex-row items-center gap-2 text-xl">
                        <span className="text-4xl font-bold">
                          ${tier.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / month
                        </span>
                      </p>
                      <div className="flex flex-col gap-4 justify-start flex-1">
                        {tier.features.map((feature, i) => (
                          <div key={i} className="flex flex-row gap-4">
                            <Check className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                              <p className="text-sm font-medium">
                                {feature.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant={tier.buttonVariant || "default"}
                        className="gap-4 w-full"
                        size="lg"
                        onClick={() => handleCheckout(tier.plan)}
                        disabled={loadingPlan !== null}
                      >
                        {loadingPlan === tier.plan ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {tier.buttonLabel}{" "}
                            <MoveRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Pricing };
