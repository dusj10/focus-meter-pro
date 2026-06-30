import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Podmínky použití — Teamlense" },
      {
        name: "description",
        content: "Podmínky použití služby Teamlense.",
      },
      { property: "og:title", content: "Podmínky použití — Teamlense" },
      {
        property: "og:description",
        content: "Podmínky použití služby Teamlense.",
      },
    ],
  }),
  component: TermsPage,
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Provozovatel",
    body: (
      <p>
        Službu Teamlense provozuje Jan Dušek,{" "}
        <a href="mailto:honzaduseku1@seznam.cz" className="text-emerald-600 hover:underline">
          honzaduseku1@seznam.cz
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. Popis služby",
    body: (
      <p>
        Teamlense je software pro sledování produktivity pracovního týmu. Zaznamenává aktivní
        aplikace a pracovní dobu zaměstnanců na zařízeních se systémem Windows.
      </p>
    ),
  },
  {
    title: "3. Podmínky používání",
    body: (
      <p>
        Službu smí používat pouze firmy a podnikatelé. Uživatel se zavazuje informovat své
        zaměstnance o instalaci agenta a účelu sledování v souladu s platnou legislativou.
        Teamlense nenese odpovědnost za způsob použití dat správcem účtu.
      </p>
    ),
  },
  {
    title: "4. Platba a předplatné",
    body: (
      <p>
        Služba je účtována měsíčně nebo ročně dle zvoleného plánu. Ceny jsou uvedeny na stránce
        ceníku. Předplatné lze kdykoli zrušit.
      </p>
    ),
  },
  {
    title: "5. Dostupnost služby",
    body: (
      <p>
        Usilujeme o dostupnost služby 24/7, nezaručujeme však nepřetržitý provoz. Vyhrazujeme si
        právo službu upravit nebo ukončit s předchozím upozorněním.
      </p>
    ),
  },
  {
    title: "6. Kontakt",
    body: (
      <p>
        <a href="mailto:honzaduseku1@seznam.cz" className="text-emerald-600 hover:underline">
          honzaduseku1@seznam.cz
        </a>
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Podmínky použití</h1>
        <p className="mt-3 text-muted-foreground">Platné od 1. července 2026</p>

        <div className="mt-12 grid gap-6">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border bg-card p-8 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
              <div className="mt-3 text-muted-foreground leading-relaxed">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
