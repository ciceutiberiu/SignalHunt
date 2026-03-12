"use client";

import { useEffect, useState, useCallback } from "react";
import { AddKeywordForm } from "@/components/keywords/add-keyword-form";
import { KeywordList } from "@/components/keywords/keyword-list";
import { KeywordLimitBadge } from "@/components/keywords/keyword-limit-badge";
import { UpgradeBanner } from "@/components/billing/upgrade-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface Keyword {
  id: string;
  keyword: string;
  is_active: boolean;
  created_at: string;
}

interface BillingStatus {
  plan: string;
  keywordLimit: number;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const [kwRes, billingRes] = await Promise.all([
      fetch("/api/keywords"),
      fetch("/api/billing/status"),
    ]);
    if (kwRes.ok) setKeywords(await kwRes.json());
    if (billingRes.ok) setBilling(await billingRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (keyword: string): Promise<boolean> => {
    const res = await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });

    if (res.ok) {
      const newKw = await res.json();
      setKeywords((prev) => [newKw, ...prev]);
      toast({ title: `Keyword "${keyword}" added` });
      return true;
    }

    const err = await res.json();
    toast({ title: err.error, variant: "destructive" });
    return false;
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/keywords/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeywords((prev) => prev.filter((k) => k.id !== id));
      toast({ title: "Keyword removed" });
    }
  };

  const handleUpgrade = async () => {
    const res = await fetch("/api/billing/create-checkout", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      router.push("/billing");
    }
  };

  const atLimit = billing ? keywords.length >= billing.keywordLimit : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Keywords</h1>
          <p className="text-muted-foreground">
            Track keywords to discover intent signals from Reddit
          </p>
        </div>
        {billing && (
          <KeywordLimitBadge current={keywords.length} limit={billing.keywordLimit} />
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <>
          {atLimit && billing?.plan === "free" && (
            <UpgradeBanner onUpgrade={handleUpgrade} />
          )}

          <AddKeywordForm onAdd={handleAdd} disabled={atLimit} />

          {keywords.length === 0 ? (
            <EmptyState
              title="No keywords yet"
              description="Add your first keyword to start discovering intent signals."
            />
          ) : (
            <KeywordList keywords={keywords} onDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  );
}
