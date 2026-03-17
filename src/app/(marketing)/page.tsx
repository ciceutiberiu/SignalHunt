import { Card, CardContent } from "@/components/ui/card";
import { SignalHero } from "@/components/ui/signal-hero";
import { Pricing } from "@/components/ui/pricing-cards";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import Link from "next/link";
import {
  Search,
  Zap,
  Target,
  ChevronDown,
  CheckCircle2,
  Radar,
  MessageSquare,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import {
  IconRadar,
  IconBolt,
  IconChartBar,
  IconTargetArrow,
  IconClock,
  IconFilter,
  IconBell,
  IconShieldCheck,
} from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <SignalHero
        badge={
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 text-sm text-orange-300 bg-orange-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            Now scanning Reddit in real-time
          </div>
        }
        title="Stop Chasing Leads."
        highlightedText="Let Them Find You."
        subtitle="SignalHunt scans Reddit 24/7 and uses AI to find people actively searching for tools like yours. Get notified when someone needs what you offer."
        ctaButton={{
          label: "Start Free",
          href: "/signup",
        }}
        secondaryButton={{
          label: "See How It Works",
          href: "#how-it-works",
        }}
        floatingIcons={[
          {
            icon: <Search className="w-7 h-7 text-orange-400" />,
            label: "Scan",
            position: { x: "8%", y: "25%" },
          },
          {
            icon: <Zap className="w-7 h-7 text-amber-400" />,
            label: "Intent",
            position: { x: "12%", y: "65%" },
          },
          {
            icon: <Target className="w-7 h-7 text-orange-400" />,
            label: "Match",
            position: { x: "82%", y: "22%" },
          },
          {
            icon: <Bookmark className="w-7 h-7 text-amber-400" />,
            label: "Save",
            position: { x: "85%", y: "62%" },
          },
        ]}
        bottomContent={
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-white/40 px-4">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-orange-500/60" />
              Free forever plan
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-orange-500/60" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-orange-500/60" />
              Setup in 30 seconds
            </span>
          </div>
        }
      />

      {/* Social proof bar */}
      <section className="border-y bg-muted/30 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-primary" />
              <span>
                <strong className="text-foreground">24/7</strong> Reddit
                scanning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>
                Powered by{" "}
                <strong className="text-foreground">Claude AI</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>
                Built for{" "}
                <strong className="text-foreground">indie hackers</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>
                <strong className="text-foreground">Millions</strong> of posts
                scanned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <FeaturesSectionWithHoverEffects
          title="Everything You Need to Capture Intent"
          subtitle="Set your keywords and let SignalHunt do the hunting. AI-powered, built for speed."
          features={[
            {
              title: "Smart Reddit Scanning",
              description:
                "Monitors Reddit 24/7 for posts matching your keywords. Target specific subreddits or search globally.",
              icon: <IconRadar className="h-6 w-6" />,
            },
            {
              title: "AI Intent Scoring",
              description:
                "Claude AI analyzes each post and scores buying intent from 0-100. Focus only on hot leads, skip the noise.",
              icon: <IconBolt className="h-6 w-6" />,
            },
            {
              title: "Actionable Dashboard",
              description:
                "Filter by intent level, keyword, or subreddit. Save leads, add notes, and track your outreach.",
              icon: <IconChartBar className="h-6 w-6" />,
            },
            {
              title: "Keyword Tracking",
              description:
                "Track what matters to your business. Free users get 1 keyword, Pro gets up to 25 with subreddit targeting.",
              icon: <IconTargetArrow className="h-6 w-6" />,
            },
            {
              title: "First-Responder Advantage",
              description:
                "Get signals within minutes of posting. Reply first and convert leads before your competitors notice.",
              icon: <IconClock className="h-6 w-6" />,
            },
            {
              title: "Noise Reduction",
              description:
                "Pre-filters self-promotion, memes, and deleted posts. Strict AI scoring separates research from real buying intent.",
              icon: <IconFilter className="h-6 w-6" />,
            },
            {
              title: "Smart Deduplication",
              description:
                "Never see the same post twice. Intelligent dedup across all your keywords and scans.",
              icon: <IconShieldCheck className="h-6 w-6" />,
            },
            {
              title: "Real-Time Alerts",
              description:
                "Get notified when high-intent signals appear. Never miss a warm lead asking for what you offer.",
              icon: <IconBell className="h-6 w-6" />,
            },
          ]}
        />
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
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />

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
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
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
                keyword: '"looking for a CRM"',
              },
              {
                title: "Freelancers",
                desc: "Discover clients who need your skills right now. No cold outreach needed.",
                keyword: '"need help with my website"',
              },
              {
                title: "Agencies",
                desc: "Fill your pipeline with warm leads actively searching for services.",
                keyword: '"marketing agency recommendations"',
              },
              {
                title: "Content Creators",
                desc: "Find trending topics and pain points your audience cares about.",
                keyword: '"best tools for creators"',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="card-hover border-transparent bg-gray-50/80 hover:bg-white hover:border-border"
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.desc}
                  </p>
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
      <section id="pricing" className="bg-gray-50">
        <Pricing />
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
                a: 'An intent signal is a Reddit post where someone is actively looking for a tool, service, or solution. For example, "Looking for a CRM that integrates with Slack" is a high-intent signal — that person is ready to buy.',
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
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
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
            Every minute you wait, someone else replies first. Start hunting for
            intent signals today.
          </p>
          <Link href="/signup">
            <button className="bg-white text-orange-600 hover:bg-gray-100 text-base px-10 h-12 rounded-lg font-medium shadow-xl shadow-orange-900/20 inline-flex items-center gap-2 transition-colors">
              Get Started Free
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
