import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TeamlenseLogo } from "@/components/team-lense-logo";
import { CookieBanner } from "@/components/cookie-banner";
import type { ReactNode } from "react";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <TeamlenseLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                O nás
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Přihlásit se
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Začít zdarma
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>Teamlense © 2026</div>
          <nav className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Zásady ochrany osobních údajů
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Podmínky použití
            </Link>
          </nav>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
