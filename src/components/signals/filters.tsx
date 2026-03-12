"use client";

import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  intentFilter: string;
  statusFilter: string;
  keywordFilter: string;
  subredditSearch: string;
  keywords: string[];
  onIntentChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onKeywordChange: (v: string) => void;
  onSubredditChange: (v: string) => void;
}

export function Filters({
  intentFilter,
  statusFilter,
  keywordFilter,
  subredditSearch,
  keywords,
  onIntentChange,
  onStatusChange,
  onKeywordChange,
  onSubredditChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={intentFilter} onChange={(e) => onIntentChange(e.target.value)} className="w-36">
        <option value="">All Intent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="none">None</option>
      </Select>

      <Select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className="w-36">
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="viewed">Viewed</option>
        <option value="saved">Saved</option>
        <option value="contacted">Contacted</option>
        <option value="archived">Archived</option>
      </Select>

      <Select value={keywordFilter} onChange={(e) => onKeywordChange(e.target.value)} className="w-40">
        <option value="">All Keywords</option>
        {keywords.map((kw) => (
          <option key={kw} value={kw}>
            {kw}
          </option>
        ))}
      </Select>

      <Input
        placeholder="Filter subreddit..."
        value={subredditSearch}
        onChange={(e) => onSubredditChange(e.target.value)}
        className="w-44"
      />
    </div>
  );
}
