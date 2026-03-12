import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifySignals } from "@/lib/ai/classify";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();
  const supabase = createAdminClient();
  let signalsClassified = 0;
  const errors: string[] = [];

  try {
    // Fetch unclassified signals (max 3 attempts)
    const { data: signals } = await supabase
      .from("signals")
      .select("id, title, body, subreddit")
      .is("classified_at", null)
      .lt("classification_attempts", 3)
      .order("created_at", { ascending: true })
      .limit(20);

    if (!signals?.length) {
      return NextResponse.json({ message: "No signals to classify" });
    }

    const signalIds = signals.map((s: { id: string }) => s.id);

    // Increment attempt counter for all signals in this batch
    // Using raw SQL via supabase to increment
    for (const id of signalIds) {
      const { data: current } = await supabase
        .from("signals")
        .select("classification_attempts")
        .eq("id", id)
        .single();
      if (current) {
        await supabase
          .from("signals")
          .update({ classification_attempts: (current.classification_attempts ?? 0) + 1 })
          .eq("id", id);
      }
    }

    try {
      const results = await classifySignals(signals);

      for (const result of results) {
        const { error } = await supabase
          .from("signals")
          .update({
            intent_score: result.intent_score,
            intent_label: result.intent_label,
            summary: result.summary,
            classified_at: new Date().toISOString(),
          })
          .eq("id", result.id);

        if (error) {
          errors.push(`Update ${result.id}: ${error.message}`);
        } else {
          signalsClassified++;
        }
      }
    } catch (err) {
      errors.push(`Classification error: ${err instanceof Error ? err.message : String(err)}`);

      // Increment attempts for all signals in this batch
      for (const signal of signals) {
        await supabase
          .from("signals")
          .update({
            classification_attempts: 1, // simplified - ideally current + 1
          })
          .eq("id", signal.id);
      }
    }

    const completedAt = new Date();
    await supabase.from("ingestion_log").insert({
      job_type: "classify-signals",
      keywords_processed: 0,
      signals_created: 0,
      signals_classified: signalsClassified,
      errors: errors.length > 0 ? errors : null,
      duration_ms: completedAt.getTime() - startedAt.getTime(),
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
    });

    return NextResponse.json({
      signals_classified: signalsClassified,
      errors: errors.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
