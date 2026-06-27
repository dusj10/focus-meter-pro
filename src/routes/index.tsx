import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Users, BarChart3, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teamlense — Přehled práce vašeho týmu na dálku" },
      {
        name: "description",
        content:
          "Sledujte aktivní čas vzdálených zaměstnanců bez narušení soukromí. Žádné screenshoty, žádné keyloggery.",
      },
      { property: "og:title", content: "Teamlense" },
      {
        property: "og:description",
        content: "Přehled práce vašeho týmu na dálku.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
              T
            </div>
            <span className="font-semibold">Teamlense</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Přihlásit se</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Začít zdarma
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground mb-6">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Soukromí na prvním místě
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
          Přehled práce vašeho týmu
          <br />
          <span className="text-muted-foreground">na dálku</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Teamlense automaticky vytváří přehled produktivity vašeho týmu.
          Víte, kdo pracuje, na čem a jak dlouho — bez jediného screenshotu.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
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
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Vše, co manažer potřebuje
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Activity className="h-5 w-5 text-emerald-600" />}
              title="Aktivní čas v reálném čase"
              desc="Vidíte, kdo právě pracuje a na čem, bez nutnosti se ptát."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5 text-emerald-600" />}
              title="Přehled celého týmu"
              desc="Jeden dashboard pro všechny zaměstnance — denně, týdně i měsíčně."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              title="Týdenní a měsíční reporty"
              desc="Automatické přehledy aktivity, kategorií aplikací a produktivity."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Jak to funguje
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, t: "Manažer pozve zaměstnance", d: "Pošlete pozvánku e-mailem během minuty." },
              { n: 2, t: "Zaměstnanec si nainstaluje agenta", d: "Lehký program běží na pozadí jeho počítače." },
              { n: 3, t: "Manažer vidí výkony v dashboardu", d: "Data se aktualizují v reálném čase." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 border-t bg-muted/20">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Jednoduché ceny
          </h2>
          <div className="mt-10 rounded-2xl border bg-card p-8 shadow-sm">
            <div className="text-sm font-medium text-emerald-600">Team</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">€15</span>
              <span className="text-muted-foreground">/měsíc</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              až 20 zaměstnanců, všechny funkce
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Sledování aktivního času",
                "Přehled celého týmu",
                "Týdenní a měsíční reporty",
                "Bez screenshotů a keyloggerů",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block mt-8">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Vyzkoušet 14 dní zdarma
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-muted-foreground text-center">
          Teamlense © 2026
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
