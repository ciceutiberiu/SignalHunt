"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search } from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  is_active: boolean;
  created_at: string;
}

interface KeywordListProps {
  keywords: Keyword[];
  onDelete: (id: string) => void;
}

export function KeywordList({ keywords, onDelete }: KeywordListProps) {
  return (
    <div className="space-y-2">
      {keywords.map((kw) => (
        <div
          key={kw.id}
          className="flex items-center justify-between rounded-lg border px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{kw.keyword}</span>
            {kw.is_active ? (
              <Badge variant="secondary" className="text-xs">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Paused</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(kw.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
