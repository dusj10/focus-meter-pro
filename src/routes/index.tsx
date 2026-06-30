import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Users, BarChart3, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamlenseLogo } from "@/components/team-lense-logo";

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
          <Link to="/" className="flex items-center">
            <TeamlenseLogo />
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

      {/* Showcase */}
      <ShowcaseSection />


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

function BrowserFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border bg-card shadow-2xl overflow-hidden ${className}`}>
      <div className="h-7 bg-muted/60 border-b flex items-center gap-1.5 px-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="bg-background">{children}</div>
    </div>
  );
}

function MockTeamOverview() {
  const rows = [
    { i: "HN", n: "Honza Novák", r: "Frontend Developer", w: 8, t: "7 min", idle: "2h 30min", app: "Microsoft Teams" },
    { i: "PS", n: "Petra Svobodová", r: "Product Designer", w: 65, t: "5h 31min", idle: "1h 7min", app: "Figma" },
    { i: "MD", n: "Martin Dvořák", r: "Backend Developer", w: 82, t: "7h 2min", idle: "1h 29min", app: "Visual Studio Code" },
  ];
  return (
    <div className="p-5 text-[11px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-base font-semibold tracking-tight">Přehled týmu</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Acme s.r.o. · pondělí 22. června 2026</div>
        </div>
        <div className="flex gap-1">
          <div className="px-2 py-0.5 rounded-md border bg-background text-[10px]">Den</div>
          <div className="px-2 py-0.5 text-[10px] text-muted-foreground">Týden</div>
          <div className="px-2 py-0.5 text-[10px] text-muted-foreground">Měsíc</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { l: "AKTIVNÍ ČLENOVÉ", v: "3 / 3" },
          { l: "PRŮMĚRNÝ ČAS", v: "4h 13min" },
          { l: "NEJPRODUKTIVNĚJŠÍ", v: "Martin" },
        ].map((c) => (
          <div key={c.l} className="rounded-lg border p-2.5">
            <div className="text-[8px] uppercase text-muted-foreground tracking-wide">{c.l}</div>
            <div className="text-sm font-semibold mt-1">{c.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border">
        {rows.map((row, idx) => (
          <div key={row.i} className={`flex items-center gap-2 px-2.5 py-2 ${idx > 0 ? "border-t" : ""}`}>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium">{row.i}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate">{row.n}</div>
              <div className="text-[9px] text-muted-foreground truncate">{row.r}</div>
            </div>
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${row.w}%` }} />
            </div>
            <div className="w-12 text-right text-[10px] tabular-nums">{row.t}</div>
            <div className="hidden sm:block w-24 text-[10px] text-muted-foreground truncate">{row.app}</div>
            <div className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] border border-emerald-200">● Aktivní</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockEmployee() {
  const bars = [6.3, 6.1, 6.2, 6.0, 0, 0, 0.1];
  const days = ["út", "st", "čt", "pá", "so", "ne", "po"];
  return (
    <div className="p-4 text-[10px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium">HN</div>
        <div>
          <div className="text-xs font-semibold">Honza Novák</div>
          <div className="text-[9px] text-muted-foreground">Frontend Developer · 22. 6. 2026</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <div className="rounded-md border p-2"><div className="text-[8px] uppercase text-muted-foreground">Aktivní dnes</div><div className="text-emerald-600 font-semibold text-sm">7 min</div></div>
        <div className="rounded-md border p-2"><div className="text-[8px] uppercase text-muted-foreground">Nečinnost</div><div className="text-amber-600 font-semibold text-sm">2h 30min</div></div>
        <div className="rounded-md border p-2"><div className="text-[8px] uppercase text-muted-foreground">Celkem</div><div className="font-semibold text-sm">2h 38min</div></div>
        <div className="rounded-md border p-2">
          <div className="text-[8px] uppercase text-muted-foreground">Tento měsíc</div>
          <div className="font-semibold text-sm">95h 58min</div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[60%]" /></div>
        </div>
      </div>
      <div className="rounded-md border p-2">
        <div className="text-[9px] font-medium mb-2">Aktivní hodiny za posledních 7 dní</div>
        <div className="flex items-end gap-1 h-20">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-emerald-500 rounded-sm" style={{ height: `${Math.max(2, (h / 8) * 100)}%` }} />
              <div className="text-[7px] text-muted-foreground">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockStatistics() {
  const emp = [{ n: "Martin", w: 92 }, { n: "Honza", w: 84 }, { n: "Petra", w: 72 }];
  return (
    <div className="p-4 text-[10px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-semibold">Statistiky týmu</div>
          <div className="text-[9px] text-muted-foreground">22.6. – 26.6.</div>
        </div>
        <div className="flex gap-1">
          <div className="px-1.5 py-0.5 rounded border bg-background text-[9px]">Týden</div>
          <div className="px-1.5 py-0.5 text-[9px] text-muted-foreground">Měsíc</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="rounded-md border p-1.5"><div className="text-[7px] uppercase text-muted-foreground">Celkem</div><div className="font-semibold text-xs">92h 4min</div></div>
        <div className="rounded-md border p-1.5"><div className="text-[7px] uppercase text-muted-foreground">Průměr</div><div className="font-semibold text-xs">30h 41min</div></div>
        <div className="rounded-md border p-1.5"><div className="text-[7px] uppercase text-muted-foreground">Změna</div><div className="font-semibold text-xs text-red-500">-0.1%</div></div>
      </div>
      <div className="rounded-md border p-2">
        <div className="text-[9px] font-medium mb-2">Srovnání zaměstnanců</div>
        <div className="space-y-2">
          {emp.map((e) => (
            <div key={e.n} className="flex items-center gap-2">
              <div className="w-10 text-[9px]">{e.n}</div>
              <div className="flex-1 h-3 bg-muted/40 rounded">
                <div className="h-full bg-emerald-500 rounded" style={{ width: `${e.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowcaseSection() {
  return (
    <section className="px-6 py-24 border-t">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight text-center">Podívejte se dovnitř</h2>
        <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
          Čistý dashboard, který vám okamžitě ukáže, jak váš tým pracuje.
        </p>

        <div className="relative mt-16 h-[420px] md:h-[480px]">
          {/* Left smaller frame */}
          <div className="hidden md:block absolute left-0 top-12 w-[320px] -rotate-6 z-10 opacity-95">
            <BrowserFrame>
              <MockEmployee />
            </BrowserFrame>
          </div>
          {/* Right smaller frame */}
          <div className="hidden md:block absolute right-0 top-12 w-[320px] rotate-6 z-10 opacity-95">
            <BrowserFrame>
              <MockStatistics />
            </BrowserFrame>
          </div>
          {/* Center large frame */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-2xl z-20">
            <BrowserFrame>
              <MockTeamOverview />
            </BrowserFrame>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {[
            "Žádné screenshoty ani keyloggery",
            "Automatický start po přihlášení do Windows",
            "Data v reálném čase",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
