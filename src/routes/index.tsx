import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TeamlenseLogo } from "@/components/team-lense-logo";
import { Check } from "lucide-react";
import screenDashboard from "@/assets/screen-dashboard.png.asset.json";
import screenEmployee from "@/assets/screen-employee.png.asset.json";
import screenApps from "@/assets/screen-apps.png.asset.json";
import screenStatistics from "@/assets/screen-statistics.png.asset.json";

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
            Přehled práce Vašeho týmu
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

        {/* ukázka rozhraní */}
        <section className="px-6 py-20 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              Ukázka rozhraní
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScreenshotImage src={screenDashboard.url} label="Dashboard přehledu týmu" />
              <ScreenshotImage src={screenEmployee.url} label="Detail zaměstnance s časovou osou" />
              <ScreenshotImage src={screenApps.url} label="Rozdělení podle aplikací" />
              <ScreenshotImage src={screenStatistics.url} label="Statistiky týmu" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 py-20 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight">Jednoduché ceny</h2>
            <p className="mt-3 text-muted-foreground">Plaťte jen za aktivní členy týmu.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <PricingCard
                title="Měsíčně"
                price="99 Kč"
                period="za člena měsíčně"
                features={[
                  "Neomezený počet zaměstnanců",
                  "Přehled v reálném čase",
                  "Časová osa dne",
                  "Statistiky a grafy",
                  "Emailová podpora",
                ]}
                buttonText="Začít zdarma"
              />
              <PricingCard
                title="Ročně"
                price="79 Kč"
                period="za člena měsíčně"
                periodNote="při platbě ročně"
                features={[
                  "Neomezený počet zaměstnanců",
                  "Přehled v reálném čase",
                  "Časová osa dne",
                  "Statistiky a grafy",
                  "Emailová podpora",
                ]}
                buttonText="Začít zdarma"
                popular
              />
            </div>
            <p className="mt-8 text-sm text-muted-foreground">Prvních 14 dní zdarma. Bez závazků.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-muted-foreground text-center">
          Teamlense © 2026
        </div>
      </footer>
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

function ScreenshotImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <img src={src} alt={label} loading="lazy" className="w-full h-auto block" />
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  periodNote,
  features,
  buttonText,
  popular,
}: {
  title: string;
  price: string;
  period: string;
  periodNote?: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}) {
  return (
    <div className="relative rounded-2xl border bg-card p-8 shadow-sm text-left">
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
            Nejoblíbenější
          </span>
        </div>
      )}
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      {periodNote && (
        <p className="mt-1 text-xs text-muted-foreground">{periodNote}</p>
      )}
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link to="/register" className="block mt-8">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
