"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UpgradeBannerProps {
  onUpgrade: () => void;
}

export function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Zap className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-sm font-medium">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground">
            Track up to 50 keywords and unlock all features.
          </p>
        </div>
      </div>
      <Button size="sm" onClick={onUpgrade}>
        Upgrade
      </Button>
    </div>
  );
}
