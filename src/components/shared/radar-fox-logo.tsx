import { cn } from "@/lib/utils/helpers";

interface RadarFoxLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function RadarFoxLogo({ className, size = "md", showText = true }: RadarFoxLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold",
          sizeClasses[size]
        )}
      >
        <svg viewBox="0 0 40 40" className="w-3/4 h-3/4" fill="none">
          {/* Fox face */}
          <path d="M8 12L14 4L18 14Z" fill="white" opacity="0.9" />
          <path d="M32 12L26 4L22 14Z" fill="white" opacity="0.9" />
          <circle cx="20" cy="20" r="10" fill="white" opacity="0.9" />
          <circle cx="16" cy="18" r="2" fill="#f97316" />
          <circle cx="24" cy="18" r="2" fill="#f97316" />
          <ellipse cx="20" cy="23" rx="3" ry="2" fill="#f97316" opacity="0.6" />
          {/* Radar waves */}
          <path d="M6 30 Q20 24 34 30" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M10 34 Q20 28 30 34" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-3xl"
          )}
        >
          Signal<span className="text-primary">Hunt</span>
        </span>
      )}
    </div>
  );
}
