import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "O Teamlense" },
      {
        name: "description",
        content:
          "Zjistěte více o Teamlense — jednoduchém nástroji pro sledování produktivity týmu.",
      },
      { property: "og:title", content: "O Teamlense" },
      {
        property: "og:description",
        content:
          "Zjistěte více o Teamlense — jednoduchém nástroji pro sledování produktivity týmu.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
          O Teamlense
        </h1>

        <div className="mt-16 grid gap-8">
          <section className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Kdo jsme</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Teamlense je nástroj pro sledování produktivity týmu zaměřený na jednoduchost a přehlednost.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Vznikl z potřeby malých a středních firem mít jasný přehled o tom, jak jejich tým pracuje, aniž by musely sahat po složitých a drahých enterprise řešeních.
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Náš produkt</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Teamlense sleduje aktivní aplikace a pracovní dobu zaměstnanců. Nezaznamenává obsah komunikace, hesla, screenshots ani stisknuté klávesy.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Sbíráme pouze to, co je potřeba pro přehled produktivity: které aplikace jsou otevřené a jak dlouho.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Aktuálně funguje na Windows.
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Co věříme</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Věříme, že dobrý manažer nepotřebuje sledovat každý pohyb svého týmu. Potřebuje vědět, zda lidé pracují a na čem. Nic víc.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Transparentní sledování produktivity pomáhá budovat důvěru, ne ji narušovat.
            </p>
          </section>

          <section className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Kontakt</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Email:{" "}
              <a
                href="mailto:info@teamlense.app"
                className="text-emerald-600 hover:underline"
              >
                info@teamlense.app
              </a>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Vytvořeno v České republice.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
