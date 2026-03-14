"use client";

import { IntentBadge } from "./intent-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncateText } from "@/lib/utils/helpers";
import { ExternalLink, Bookmark, Archive, Eye, Trash2 } from "lucide-react";
import type { SignalStatus, IntentLabel } from "@/lib/utils/constants";

export interface SignalRow {
  id: string;
  title: string | null;
  body: string | null;
  subreddit: string;
  author: string;
  reddit_url: string;
  reddit_created_at: string;
  matched_keyword: string;
  intent_score: number | null;
  intent_label: IntentLabel | null;
  summary: string | null;
  upvotes: number;
  num_comments: number;
  user_status: SignalStatus;
  user_notes: string | null;
}

interface SignalsTableProps {
  signals: SignalRow[];
  onSelect: (signal: SignalRow) => void;
  onUpdateStatus: (signalId: string, status: SignalStatus) => void;
  onDelete?: (signalId: string) => void;
  sortField: string;
  sortDir: "asc" | "desc";
  onSort: (field: string) => void;
}

export function SignalsTable({
  signals,
  onSelect,
  onUpdateStatus,
  onDelete,
  sortField,
  sortDir,
  onSort,
}: SignalsTableProps) {
  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="text-left text-xs font-medium text-muted-foreground px-4 py-3 cursor-pointer hover:text-foreground select-none"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortField === field && (sortDir === "asc" ? " ↑" : " ↓")}
      </span>
    </th>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <SortHeader field="intent_score">Intent</SortHeader>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Signal</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Subreddit</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Keyword</th>
              <SortHeader field="reddit_created_at">Date</SortHeader>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {signals.map((signal) => (
              <tr
                key={signal.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  signal.user_status === "viewed" ? "opacity-60" : ""
                } ${signal.user_status === "archived" ? "opacity-40" : ""}`}
                onClick={() => onSelect(signal)}
              >
                <td className="px-4 py-3">
                  <IntentBadge label={signal.intent_label} score={signal.intent_score} />
                </td>
                <td className="px-4 py-3 max-w-md">
                  <p className="text-sm font-medium truncate">
                    {signal.title || truncateText(signal.body || "No content", 80)}
                  </p>
                  {signal.summary && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{signal.summary}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">
                    r/{signal.subreddit}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">{signal.matched_keyword}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(signal.reddit_created_at)}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${signal.user_status === "saved" ? "text-orange-500 bg-orange-50 hover:bg-orange-100 hover:text-orange-600" : ""}`}
                      title={signal.user_status === "saved" ? "Saved" : "Save"}
                      onClick={() => onUpdateStatus(signal.id, signal.user_status === "saved" ? "new" : "saved")}
                    >
                      <Bookmark className={`h-4 w-4 ${signal.user_status === "saved" ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${signal.user_status === "viewed" ? "text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600" : ""}`}
                      title={signal.user_status === "viewed" ? "Viewed" : "Mark viewed"}
                      onClick={() => onUpdateStatus(signal.id, signal.user_status === "viewed" ? "new" : "viewed")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${signal.user_status === "archived" ? "text-gray-500 bg-gray-100 hover:bg-gray-200" : ""}`}
                      title={signal.user_status === "archived" ? "Archived" : "Archive"}
                      onClick={() => onUpdateStatus(signal.id, signal.user_status === "archived" ? "new" : "archived")}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    {onDelete && signal.user_status === "archived" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                        onClick={() => onDelete(signal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <a
                      href={signal.reddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Open on Reddit">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
