import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Zásady ochrany osobních údajů — Teamlense" },
      {
        name: "description",
        content:
          "Zásady ochrany osobních údajů služby Teamlense. Jaké údaje sbíráme a jak je chráníme.",
      },
      { property: "og:title", content: "Zásady ochrany osobních údajů — Teamlense" },
      {
        property: "og:description",
        content:
          "Zásady ochrany osobních údajů služby Teamlense. Jaké údaje sbíráme a jak je chráníme.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Správce osobních údajů",
    body: (
      <p>
        Jan Dušek, kontaktní email:{" "}
        <a href="mailto:honzaduseku1@seznam.cz" className="text-emerald-600 hover:underline">
          honzaduseku1@seznam.cz
        </a>
        .
      </p>
    ),
  },
  {
    title: "2. Jaké údaje sbíráme",
    body: (
      <>
        <p>
          Teamlense sbírá následující údaje o aktivitě zaměstnanců: název aktivní aplikace na
          počítači, časové razítko záznamu, zda byl uživatel aktivní nebo nečinný, délku aktivity
          v sekundách.
        </p>
        <p className="mt-3">
          Teamlense <strong>NESDÍRÁ</strong>: obsah komunikace, emaily, hesla, screenshots
          obrazovky, stisknuté klávesy ani osobní soubory.
        </p>
      </>
    ),
  },
  {
    title: "3. Účel zpracování",
    body: (
      <p>
        Údaje jsou zpracovávány výhradně za účelem sledování produktivity pracovního týmu. Přístup
        k datům má pouze správce firemního účtu (manažer).
      </p>
    ),
  },
  {
    title: "4. Právní základ zpracování",
    body: (
      <p>
        Zpracování probíhá na základě oprávněného zájmu zaměstnavatele (čl. 6 odst. 1 písm. f
        GDPR) nebo na základě souhlasu zaměstnance.
      </p>
    ),
  },
  {
    title: "5. Doba uchovávání",
    body: (
      <p>Údaje jsou uchovávány po dobu trvání předplatného a 30 dní po jeho ukončení.</p>
    ),
  },
  {
    title: "6. Předávání třetím stranám",
    body: (
      <p>
        Data jsou uložena na serverech Supabase (EU region) a Railway. Neprodáváme ani nesdílíme
        data s třetími stranami za marketingovými účely.
      </p>
    ),
  },
  {
    title: "7. Vaše práva",
    body: (
      <p>
        Máte právo na přístup ke svým údajům, jejich opravu, výmaz nebo přenositelnost. Žádost
        zašlete na{" "}
        <a href="mailto:honzaduseku1@seznam.cz" className="text-emerald-600 hover:underline">
          honzaduseku1@seznam.cz
        </a>
        .
      </p>
    ),
  },
  {
    title: "8. Cookies",
    body: (
      <p>
        Tento web používá pouze technické cookies nezbytné pro fungování přihlášení. Nepoužíváme
        analytické ani marketingové cookies.
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Zásady ochrany osobních údajů
        </h1>
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
