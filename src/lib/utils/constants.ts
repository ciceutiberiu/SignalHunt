export const PLANS = {
  free: {
    name: "Free",
    keywordLimit: 1,
    price: 0,
  },
  pro: {
    name: "Pro",
    keywordLimit: 50,
    price: 29,
  },
} as const;

export const SIGNAL_STATUSES = [
  "new",
  "viewed",
  "saved",
  "contacted",
  "archived",
] as const;

export type SignalStatus = (typeof SIGNAL_STATUSES)[number];

export const INTENT_LABELS = ["high", "medium", "low", "none"] as const;
export type IntentLabel = (typeof INTENT_LABELS)[number];

export const INTENT_COLORS: Record<IntentLabel, { bg: string; text: string }> = {
  high: { bg: "bg-green-100", text: "text-green-800" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
  low: { bg: "bg-gray-100", text: "text-gray-600" },
  none: { bg: "bg-gray-50", text: "text-gray-400" },
};
