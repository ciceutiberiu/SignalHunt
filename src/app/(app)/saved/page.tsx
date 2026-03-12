"use client";

import { useEffect, useState, useCallback } from "react";
import { SignalsTable, type SignalRow } from "@/components/signals/signals-table";
import { SignalDetailSheet } from "@/components/signals/signal-detail-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useToast } from "@/components/ui/toast";
import type { SignalStatus } from "@/lib/utils/constants";

export default function SavedPage() {
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<SignalRow | null>(null);
  const [sortField, setSortField] = useState("reddit_created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const fetchSaved = useCallback(async () => {
    const res = await fetch("/api/signals?status=saved");
    if (res.ok) {
      const data = await res.json();
      setSignals(data.signals);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleUpdateStatus = async (signalId: string, status: SignalStatus) => {
    const res = await fetch(`/api/signals/${signalId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      if (status !== "saved") {
        setSignals((prev) => prev.filter((s) => s.id !== signalId));
      }
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

  const handleSort = (field: string) => {
    if (field === sortField) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Signals</h1>
        <p className="text-muted-foreground">Signals you&apos;ve saved for follow-up</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : signals.length === 0 ? (
        <EmptyState
          title="No saved signals"
          description="Save signals from the dashboard to track them here."
          actionLabel="Go to Dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <>
          <SignalsTable
            signals={signals}
            onSelect={setSelectedSignal}
            onUpdateStatus={handleUpdateStatus}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
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
