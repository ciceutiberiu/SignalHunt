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
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl animate-float animation-delay-200" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-orange-300/10 rounded-full blur-2xl animate-float animation-delay-600" />

        <div className="relative mx-auto max-w-6xl px-4 py-28 md:py-40 text-center">
          <div className="animate-fade-in-down flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-sm text-orange-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Now scanning Reddit in real-time
            </div>
          </div>

          <h1 className="animate-fade-in-up text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Stop Chasing Leads.
            <br />
            <span className="gradient-text">Let Them Find You.</span>
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SignalHunt scans Reddit 24/7 and uses AI to find people
            <strong className="text-foreground"> actively searching </strong>
            for tools like yours. Get notified when someone needs what you offer.
          </p>

          <div className="animate-fade-in-up animation-delay-400 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 h-12 animate-pulse-glow">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="animate-fade-in-up animation-delay-600 mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Setup in 30 seconds
            </span>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y bg-muted/30 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span><strong className="text-foreground">24/7</strong> Reddit scanning</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Powered by <strong className="text-foreground">Claude AI</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Built for <strong className="text-foreground">indie hackers</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span><strong className="text-foreground">Millions</strong> of posts scanned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="gradient-text"> Capture Intent</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Set your keywords and let SignalHunt do the hunting.
              AI-powered, built for speed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Smart Reddit Scanning",
                desc: "Monitors Reddit every 5 minutes for posts matching your keywords. Never miss a potential lead.",
              },
              {
                icon: Zap,
                title: "AI Intent Scoring",
                desc: "Claude AI analyzes each post and scores buying intent from 0-100. Focus only on hot leads.",
              },
              {
                icon: BarChart3,
                title: "Actionable Dashboard",
                desc: "Filter by intent, keyword, subreddit. Save leads, add notes, track your outreach.",
              },
              {
                icon: Target,
                title: "Keyword Tracking",
                desc: "Track what matters to your business. Free users get 1 keyword, Pro gets up to 25.",
              },
              {
                icon: Clock,
                title: "First-Responder Advantage",
                desc: "Get signals within minutes of posting. Reply first and convert more leads.",
              },
              {
                icon: Bell,
                title: "Smart Deduplication",
                desc: "Never see the same post twice. Intelligent dedup across all your keywords.",
              },
            ].map((feature, i) => (
              <Card key={feature.title} className="card-hover group border-transparent bg-gray-50/80 hover:bg-white hover:border-border">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-3 group-hover:from-orange-200 group-hover:to-amber-100 transition-colors animation-delay-${i * 200}`}>
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to Your First Lead
            </h2>
            <p className="text-muted-foreground text-lg">
              From signup to your first signal in under 2 minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />

            {[
              {
                step: "1",
                title: "Add Your Keywords",
                desc: "Tell us what you offer — CRM, project management, web design, anything. We start scanning Reddit immediately.",
              },
              {
                step: "2",
                title: "AI Scores Every Post",
                desc: "Our AI reads each Reddit post and scores buying intent. You only see the signals that matter.",
              },
              {
                step: "3",
                title: "Engage & Convert",
                desc: "Reply to people who need what you offer. Track your outreach right in the dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-orange-200 card-hover">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who Uses SignalHunt?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "SaaS Founders",
                desc: "Find people asking for tools like yours. Reply with value, convert with ease.",
                keyword: "\"looking for a CRM\"",
              },
              {
                title: "Freelancers",
                desc: "Discover clients who need your skills right now. No cold outreach needed.",
                keyword: "\"need help with my website\"",
              },
              {
                title: "Agencies",
                desc: "Fill your pipeline with warm leads actively searching for services.",
                keyword: "\"marketing agency recommendations\"",
              },
              {
                title: "Content Creators",
                desc: "Find trending topics and pain points your audience cares about.",
                keyword: "\"best tools for creators\"",
              },
            ].map((item) => (
              <Card key={item.title} className="card-hover border-transparent bg-gray-50/80 hover:bg-white hover:border-border">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                  <code className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md border border-orange-200">
                    {item.keyword}
                  </code>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Honest Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade when you need more signals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-hover">
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
            </div>
            <div className="card-hover">
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
                buttonLabel="Start Starter"
                onSelect={undefined}
              />
            </div>
            <div className="card-hover">
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
                buttonLabel="Start Pro"
                onSelect={undefined}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "What is an intent signal?",
                a: "An intent signal is a Reddit post where someone is actively looking for a tool, service, or solution. For example, 'Looking for a CRM that integrates with Slack' is a high-intent signal — that person is ready to buy.",
              },
              {
                q: "How does the AI scoring work?",
                a: "We use Claude AI to analyze each Reddit post and score it from 0-100 based on buying intent. Posts are labeled as high, medium, low, or none intent so you can focus on the hottest leads.",
              },
              {
                q: "How often are signals updated?",
                a: "We scan Reddit every 5 minutes for new posts matching your keywords. AI classification runs shortly after. You can also manually trigger a scan from the dashboard.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period.",
              },
              {
                q: "What subreddits are scanned?",
                a: "We search across all of Reddit. Signals are tagged with their subreddit so you can filter by community.",
              },
              {
                q: "How is this different from just searching Reddit manually?",
                a: "Manual searches are inconsistent and time-consuming. SignalHunt runs 24/7, scores intent with AI so you skip the noise, and notifies you of hot leads within minutes of posting. The first-responder advantage is real.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <summary className="flex items-center justify-between font-medium list-none">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Next Customer Is on Reddit
            <br />
            <span className="opacity-90">Right Now.</span>
          </h2>
          <p className="text-lg mb-10 opacity-90 max-w-xl mx-auto">
            Every minute you wait, someone else replies first.
            Start hunting for intent signals today.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 text-base px-10 h-12 shadow-xl shadow-orange-900/20"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
