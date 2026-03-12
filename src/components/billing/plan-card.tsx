import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

interface PlanCardProps {
  name: string;
  price: number;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
  buttonLabel?: string;
}

export function PlanCard({
  name,
  price,
  features,
  isCurrent,
  isPopular,
  onSelect,
  buttonLabel = "Get Started",
}: PlanCardProps) {
  return (
    <Card className={cn("relative", isPopular && "border-primary shadow-md")}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-4xl font-bold">${price}</span>
          {price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        {onSelect && (
          <Button
            className="w-full"
            variant={isPopular ? "default" : "outline"}
            onClick={onSelect}
            disabled={isCurrent}
          >
            {isCurrent ? "Current Plan" : buttonLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
