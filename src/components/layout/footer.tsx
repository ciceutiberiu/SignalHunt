import { RadarFoxLogo } from "@/components/shared/radar-fox-logo";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <RadarFoxLogo size="sm" />
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Discover intent signals from Reddit. Find people actively looking for what you offer.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground">Features</a>
                <a href="#pricing" className="block hover:text-foreground">Pricing</a>
                <a href="#faq" className="block hover:text-foreground">FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Account</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/login" className="block hover:text-foreground">Log in</a>
                <a href="/signup" className="block hover:text-foreground">Sign up</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SignalHunt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
