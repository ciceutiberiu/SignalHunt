import { cn } from "@/lib/utils/helpers";
import { INTENT_COLORS, type IntentLabel } from "@/lib/utils/constants";

interface IntentBadgeProps {
  label: IntentLabel | null;
  score?: number | null;
}

export function IntentBadge({ label, score }: IntentBadgeProps) {
  if (!label) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-400">
        Pending
      </span>
    );
  }

  const colors = INTENT_COLORS[label];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text
      )}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
      {score != null && <span className="opacity-70">({score})</span>}
    </span>
  );
}
