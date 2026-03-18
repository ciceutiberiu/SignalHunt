"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarFoxLogo } from "@/components/shared/radar-fox-logo";
import { CheckCircle2, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/billing/verify-checkout?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "paid") {
          setEmail(data.email);
          setPlan(data.plan);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") return <LoadingState />;

  if (status === "error") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <RadarFoxLogo size="md" />
            </div>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your payment. If you were charged, don&apos;t worry —
              your account will be set up shortly. Contact support if the issue persists.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to SignalHunt!</CardTitle>
          <CardDescription className="text-base">
            Your {plan === "pro" ? "Pro" : "Starter"} plan is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Mail className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-900">Check your email</p>
              <p className="text-sm text-orange-700 mt-1">
                We sent a login link to <strong>{email}</strong>. Click it to access your dashboard
                and start hunting for signals.
              </p>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Already have an account?
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Log in with password
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
