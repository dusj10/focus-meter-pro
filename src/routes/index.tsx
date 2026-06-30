import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TeamlenseLogo } from "@/components/team-lense-logo";
import { ImageIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teamlense — Víte, co váš tým právě dělá?" },
      {
        name: "description",
        content:
          "Teamlense sleduje aktivitu vašeho týmu v reálném čase. Vidíte kdo pracuje, na čem a jak dlouho.",
      },
      { property: "og:title", content: "Teamlense" },
      {
        property: "og:description",
        content: "Teamlense sleduje aktivitu vašeho týmu v reálném čase.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <TeamlenseLogo />
          </Link>
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

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Víte, co váš tým právě dělá?
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Teamlense sleduje aktivitu vašeho týmu v reálném čase. Vidíte kdo pracuje, na čem a jak dlouho.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Začít zdarma
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Přihlásit se
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Funguje na Windows.</p>
        </section>

        {/* How it works */}
        <section className="px-6 py-20 border-t bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              Jak to funguje
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <StepCard
                title="Stáhnete si agenta"
                desc="Jednoduchý installer spustíte na počítačích vašeho týmu."
              />
              <StepCard
                title="Data přicházejí automaticky"
                desc="Teamlense sleduje aktivní aplikace a pracovní dobu bez zásahu uživatele."
              />
              <StepCard
                title="Vidíte přehled v reálném čase"
                desc="Dashboard ukáže kdo pracuje, na čem a jak dlouho."
              />
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="px-6 py-20 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              Screenshots
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScreenshotPlaceholder label="Dashboard přehledu týmu" />
              <ScreenshotPlaceholder label="Detail zaměstnance s časovou osou" />
              <ScreenshotPlaceholder label="Rozdělení podle aplikací" />
              <ScreenshotPlaceholder label="Statistiky týmu" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl border bg-muted/50 shadow-sm flex flex-col items-center justify-center aspect-video p-6 text-center">
      <ImageIcon className="h-10 w-10 text-muted-foreground/60 mb-4" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
