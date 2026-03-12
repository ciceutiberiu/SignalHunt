"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RadarFoxLogo } from "@/components/shared/radar-fox-logo";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <Link href="/">
          <RadarFoxLogo size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
            How it works
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3 bg-white">
          <Link href="#features" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</Link>
          <Link href="#how-it-works" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>How it works</Link>
          <Link href="#pricing" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="#faq" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>FAQ</Link>
          <div className="flex gap-2 pt-2">
            <Link href="/login"><Button variant="outline" size="sm">Log in</Button></Link>
            <Link href="/signup"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}
