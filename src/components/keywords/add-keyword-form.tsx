"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddKeywordFormProps {
  onAdd: (keyword: string) => Promise<boolean>;
  disabled?: boolean;
}

export function AddKeywordForm({ onAdd, disabled }: AddKeywordFormProps) {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    const success = await onAdd(trimmed);
    if (success) setKeyword("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
    </form>
  );
}
