"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface AddKeywordFormProps {
  onAdd: (keyword: string, subreddits?: string) => Promise<boolean>;
  disabled?: boolean;
}

export function AddKeywordForm({ onAdd, disabled }: AddKeywordFormProps) {
  const [keyword, setKeyword] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    const success = await onAdd(trimmed, subreddits.trim() || undefined);
    if (success) {
      setKeyword("");
      setSubreddits("");
      setShowAdvanced(false);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter a keyword (e.g., CRM, project management)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={disabled || loading}
          className="max-w-sm"
        />
        <Button type="submit" disabled={disabled || loading || !keyword.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Target specific subreddits (optional)
      </button>
      {showAdvanced && (
        <div className="pl-0">
          <Input
            placeholder="e.g., SaaS, startups, smallbusiness (comma-separated)"
            value={subreddits}
            onChange={(e) => setSubreddits(e.target.value)}
            disabled={disabled || loading}
            className="max-w-sm text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to search all of Reddit. Add subreddits to reduce noise and get more relevant signals.
          </p>
        </div>
      )}
    </form>
  );
}
