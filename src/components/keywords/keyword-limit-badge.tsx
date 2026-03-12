import { Badge } from "@/components/ui/badge";

interface KeywordLimitBadgeProps {
  current: number;
  limit: number;
}

export function KeywordLimitBadge({ current, limit }: KeywordLimitBadgeProps) {
  const atLimit = current >= limit;
  return (
    <Badge variant={atLimit ? "destructive" : "secondary"} className="text-xs">
      {current}/{limit} keywords
    </Badge>
  );
}
