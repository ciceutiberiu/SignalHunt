"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SignalsTable, type SignalRow } from "@/components/signals/signals-table";
import { SignalDetailSheet } from "@/components/signals/signal-detail-sheet";
import { Filters } from "@/components/signals/filters";
import { EmptyState } from "@/components/shared/empty-state";
import { StatsSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap, Bookmark, Inbox, RefreshCw } from "lucide-react";
import type { SignalStatus } from "@/lib/utils/constants";

interface Stats {
  total: number;
  new: number;
  highIntent: number;
  saved: number;
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<SignalRow | null>(null);
  const [intentFilter, setIntentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [subredditSearch, setSubredditSearch] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sortField, setSortField] = useState("reddit_created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (intentFilter) params.set("intent", intentFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (keywordFilter) params.set("keyword", keywordFilter);
      if (subredditSearch) params.set("subreddit", subredditSearch);
      params.set("sort", sortField);
      params.set("dir", sortDir);

      const [signalsRes, statsRes, keywordsRes] = await Promise.all([
        fetch(`/api/signals?${params}`),
        fetch("/api/stats"),
        fetch("/api/keywords"),
      ]);

      if (signalsRes.ok) {
        const data = await signalsRes.json();
        setSignals(data.signals);
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (keywordsRes.ok) {
        const kws = await keywordsRes.json();
        setKeywords(kws.map((k: { keyword: string }) => k.keyword));
      }
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [intentFilter, statusFilter, keywordFilter, subredditSearch, sortField, sortDir, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (signalId: string, status: SignalStatus) => {
    const res = await fetch(`/api/signals/${signalId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, user_status: status } : s))
      );
      toast({ title: `Signal marked as ${status}` });
    }
  };

  const handleUpdateNotes = async (signalId: string, notes: string) => {
    const res = await fetch(`/api/signals/${signalId}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, user_notes: notes } : s))
      );
      toast({ title: "Notes saved" });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/signals/refresh", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const msg = `Scan complete: ${data.signals_created ?? 0} new signals found`;
        const desc = data.errors?.length ? `Errors: ${data.errors.join("; ")}` : undefined;
        toast({ title: msg, description: desc, variant: data.errors?.length ? "destructive" : "default" });
        await fetchData();
      } else {
        toast({ title: data.error || "Refresh failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Refresh failed", variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (signalId: string) => {
    const res = await fetch(`/api/signals/${signalId}/status`, { method: "DELETE" });
    if (res.ok) {
      setSignals((prev) => prev.filter((s) => s.id !== signalId));
      toast({ title: "Signal deleted" });
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const statCards = [
    { label: "Total Signals", value: stats?.total ?? 0, icon: BarChart3 },
    { label: "New", value: stats?.new ?? 0, icon: Inbox },
    { label: "High Intent", value: stats?.highIntent ?? 0, icon: Zap },
    { label: "Saved", value: stats?.saved ?? 0, icon: Bookmark },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your intent signals at a glance</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Scanning..." : "Scan Reddit"}
        </Button>
      </div>

      {loading ? (
        <>
          <StatsSkeleton />
          <TableSkeleton />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Filters
            intentFilter={intentFilter}
            statusFilter={statusFilter}
            keywordFilter={keywordFilter}
            subredditSearch={subredditSearch}
            keywords={keywords}
            onIntentChange={setIntentFilter}
            onStatusChange={setStatusFilter}
            onKeywordChange={setKeywordFilter}
            onSubredditChange={setSubredditSearch}
          />

          {signals.length === 0 ? (
            <EmptyState
              title="No signals yet"
              description="Add keywords to start tracking intent signals from Reddit."
              actionLabel="Add Keywords"
              actionHref="/keywords"
            />
          ) : (
            <SignalsTable
              signals={signals}
              onSelect={setSelectedSignal}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}

          <SignalDetailSheet
            signal={selectedSignal}
            onClose={() => setSelectedSignal(null)}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
          />
        </>
      )}
    </div>
  );
}
