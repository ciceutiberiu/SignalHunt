import { getAnthropicClient } from "./client";
import { truncateText } from "@/lib/utils/helpers";

interface SignalForClassification {
  id: string;
  title: string | null;
  body: string | null;
  subreddit: string;
  upvotes?: number;
  num_comments?: number;
}

interface ClassificationResult {
  id: string;
  intent_label: "high" | "medium" | "low" | "none";
  intent_score: number;
  summary: string;
}

const SYSTEM_PROMPT = `You are a strict buying-intent classifier. Your job is to separate genuine buying/seeking signals from noise. Most posts are NOT buying intent — be skeptical by default.

CRITICAL DISTINCTION — research vs. buying intent:
- "What's the best CRM?" = research/curiosity, NOT buying intent (medium at best)
- "We need a CRM for our 10-person sales team, budget $50/mo" = genuine buying intent (high)
- "Looking for recommendations for X" = could be either — look for specificity (budget, timeline, team size, use case details) to determine if genuine
- "Has anyone used X?" = review-seeking, usually research (low-medium)
- "I built X" or "Check out my tool" = self-promotion, NEVER buying intent (none)

Intent Levels — BE STRICT, most posts should be "low" or "none":
- "high" (score 75-100): Author has a SPECIFIC, URGENT need. They mention concrete requirements, budget, timeline, team size, or are explicitly asking to buy/subscribe. Must show clear purchase readiness, not just curiosity.
- "medium" (score 45-74): Author has a real problem and is exploring solutions, but hasn't committed to buying. They describe pain points with some specificity. General "what's the best X?" questions cap at 55 unless they add context showing real need.
- "low" (score 15-44): Tangential discussion, casual mentions, general curiosity, academic research, or "just browsing" energy. Includes most listicle-style "what do you use?" posts.
- "none" (score 0-14): No buying signal at all. News, memes, self-promotion, show-and-tell, tutorials, meta-discussions, or completely off-topic.

Scoring boosters (increase score within the label range):
- Mentions specific budget or pricing expectations (+10)
- Mentions timeline or urgency ("this week", "ASAP", "before Q2") (+10)
- Describes specific use case with details (+5)
- Post has high engagement (many comments) suggesting real discussion (+5)

Scoring penalties (decrease score):
- Vague or generic question with no specifics (-10)
- Post is in a general/large subreddit vs. niche one (-5)
- Author seems to be doing academic/market research (-15)
- Post reads like content marketing or self-promotion (force to "none")

For the summary field: Write ONE actionable sentence explaining WHY you gave this score. Focus on what makes it a real signal or noise.

Respond with a JSON array only. No other text.`;

export async function classifySignals(
  signals: SignalForClassification[]
): Promise<ClassificationResult[]> {
  const client = getAnthropicClient();

  const postsForPrompt = signals.map((s) => ({
    id: s.id,
    title: s.title || "",
    body: truncateText(s.body || "", 500),
    subreddit: s.subreddit,
    upvotes: s.upvotes ?? 0,
    num_comments: s.num_comments ?? 0,
  }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Classify these posts for buying/seeking intent. Return a JSON array with objects containing: id, intent_label, intent_score, summary (one sentence).

Posts:
${JSON.stringify(postsForPrompt, null, 2)}`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse classification response");
  }

  const results: ClassificationResult[] = JSON.parse(jsonMatch[0]);
  return results;
}
