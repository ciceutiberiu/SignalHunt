import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarFoxLogo } from "@/components/shared/radar-fox-logo";
import { PlanCard } from "@/components/billing/plan-card";
import Link from "next/link";
import {
  Search,
  Zap,
  BarChart3,
  Target,
  Clock,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
          <div className="flex justify-center mb-6">
            <RadarFoxLogo size="lg" showText={false} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find People <span className="text-primary">Actively Looking</span>
            <br /> For What You Offer
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            SignalHunt scans Reddit to detect intent signals — posts where people are searching
            for tools, services, or solutions like yours. Never miss a lead again.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Start Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Capture Intent
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Powered by AI, designed for speed. Set your keywords and let Radar Fox do the hunting.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Smart Reddit Scanning",
                desc: "Automatically monitors Reddit for posts matching your keywords, updated every 5 minutes.",
              },
              {
                icon: Zap,
                title: "AI Intent Scoring",
                desc: "Claude AI analyzes each post to determine buying intent with high/medium/low scoring.",
              },
              {
                icon: BarChart3,
                title: "Actionable Dashboard",
                desc: "Filter, sort, save, and track signals. Mark leads as contacted and add notes.",
              },
              {
                icon: Target,
                title: "Keyword Tracking",
                desc: "Track the keywords that matter to your business. Pro users get up to 50 keywords.",
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                desc: "Signals appear within minutes of being posted. Stay ahead of your competition.",
              },
              {
                icon: Bell,
                title: "Smart Deduplication",
                desc: "Never see the same post twice. Intelligent dedup across all your keywords.",
              },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Three Steps to Your First Signal
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add Your Keywords",
                desc: "Tell us what you offer — CRM, project management, web design, anything. We'll start scanning Reddit immediately.",
              },
              {
                step: "2",
                title: "AI Scores Every Post",
                desc: "Our AI analyzes each Reddit post for buying intent, giving you a clear signal of who's actively looking.",
              },
              {
                step: "3",
                title: "Engage & Convert",
                desc: "Jump into conversations where people need what you offer. Track your outreach right in the dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Start free, upgrade when you&apos;re ready.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PlanCard
              name="Free"
              price={0}
              features={[
                "1 keyword to track",
                "AI intent scoring",
                "Basic dashboard",
                "5-minute updates",
              ]}
              buttonLabel="Get Started"
              onSelect={undefined}
            />
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
              buttonLabel="Start Pro"
              onSelect={undefined}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is an intent signal?",
                a: "An intent signal is a post where someone is actively looking for a tool, service, or solution. For example, 'Looking for a CRM that integrates with Slack' is a high-intent signal.",
              },
              {
                q: "How does the AI scoring work?",
                a: "We use Claude AI to analyze each Reddit post and score it from 0-100 based on buying intent. Posts are labeled as high, medium, low, or none intent.",
              },
              {
                q: "How often are signals updated?",
                a: "We scan Reddit every 5 minutes for new posts matching your keywords. AI classification runs shortly after.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your Pro subscription at any time. You'll keep Pro access until the end of your billing period.",
              },
              {
                q: "What subreddits are scanned?",
                a: "We search across all of Reddit. Signals are tagged with their subreddit so you can filter by community.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group border rounded-lg p-4 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium list-none">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Next Customer?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start hunting for intent signals today. Free plan available.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 text-base px-8"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
