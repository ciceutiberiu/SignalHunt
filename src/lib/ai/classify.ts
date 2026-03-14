import { getAnthropicClient } from "./client";
import { truncateText } from "@/lib/utils/helpers";

interface SignalForClassification {
  id: string;
  title: string | null;
  body: string | null;
  subreddit: string;
}

interface ClassificationResult {
  id: string;
  intent_label: "high" | "medium" | "low" | "none";
  intent_score: number;
  summary: string;
}

const SYSTEM_PROMPT = `You are an intent signal classifier for online posts. Analyze each post and determine if the author is actively looking for a tool, service, or solution.

Intent Levels:
- "high" (score 70-100): Author is actively seeking/buying a solution. Keywords like "looking for", "need a tool", "recommendations for", "best X for", "anyone use".
- "medium" (score 40-69): Author discusses a problem that could be solved by a product/service but isn't explicitly searching. Shows frustration or asks for advice.
- "low" (score 10-39): Tangentially related discussion. Mentions the topic but no clear buying intent.
- "none" (score 0-9): Irrelevant, memes, news, or no intent signal.

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
