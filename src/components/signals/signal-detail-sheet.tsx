"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { IntentBadge } from "./intent-badge";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/helpers";
import { ExternalLink, MessageSquare, ArrowUp } from "lucide-react";
import type { SignalStatus } from "@/lib/utils/constants";

interface Signal {
  id: string;
  title: string | null;
  body: string | null;
  subreddit: string;
  author: string;
  reddit_url: string;
  reddit_created_at: string;
  matched_keyword: string;
  intent_score: number | null;
  intent_label: "high" | "medium" | "low" | "none" | null;
  summary: string | null;
  upvotes: number;
  num_comments: number;
  user_status: SignalStatus;
  user_notes: string | null;
}

interface SignalDetailSheetProps {
  signal: Signal | null;
  onClose: () => void;
  onUpdateStatus: (signalId: string, status: SignalStatus) => void;
  onUpdateNotes: (signalId: string, notes: string) => void;
}

export function SignalDetailSheet({ signal, onClose, onUpdateStatus, onUpdateNotes }: SignalDetailSheetProps) {
  const [notes, setNotes] = useState(signal?.user_notes ?? "");
  const [saving, setSaving] = useState(false);

  if (!signal) return null;

  const handleSaveNotes = async () => {
    setSaving(true);
    await onUpdateNotes(signal.id, notes);
    setSaving(false);
  };

  return (
    <Sheet open={!!signal} onClose={onClose} title="Signal Details">
      <div className="space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <IntentBadge label={signal.intent_label} score={signal.intent_score} />
          <Badge variant="secondary">r/{signal.subreddit}</Badge>
          <Badge variant="outline">{signal.matched_keyword}</Badge>
        </div>

        <div>
          <h3 className="font-semibold text-lg">{signal.title || "No title"}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            by u/{signal.author} &middot; {formatRelativeTime(signal.reddit_created_at)}
          </p>
        </div>

        {signal.summary && (
          <div className="bg-accent rounded-md p-3">
            <p className="text-sm font-medium mb-1">AI Summary</p>
            <p className="text-sm text-muted-foreground">{signal.summary}</p>
          </div>
        )}

        {signal.body && (
          <div>
            <p className="text-sm font-medium mb-1">Original Post</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{signal.body}</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4" /> {signal.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> {signal.num_comments}
          </span>
        </div>

        <a
          href={signal.reddit_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          View on Reddit
        </a>

        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={signal.user_status}
              onChange={(e) => onUpdateStatus(signal.id, e.target.value as SignalStatus)}
            >
              <option value="new">New</option>
              <option value="viewed">Viewed</option>
              <option value="saved">Saved</option>
              <option value="contacted">Contacted</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes..."
              rows={3}
            />
            <Button size="sm" className="mt-2" onClick={handleSaveNotes} disabled={saving}>
              {saving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
