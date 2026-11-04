import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CRM_API } from "@/lib/crm";
import { formatPageDate, useCustomPages } from "@/lib/site-content";
import { useInsightsText } from "@/lib/site-content";

/**
 * Switched off for now: there are no articles yet, so the page is hidden from the site. Anyone who types
 * the address lands on the home page, and search engines are told to skip it. Set this to true to bring
 * the page back (then also restore the footer link in data/page-lists.ts and Gia's page list).
 */
const INSIGHTS_VISIBLE = false;

export const Route = createFileRoute("/insights")({
  beforeLoad: () => {
    if (!INSIGHTS_VISIBLE) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      ...(INSIGHTS_VISIBLE ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
      { title: "Insights & Updates | Growth Capital Services" },
      {
        name: "description",
        content:
          "Guides, updates and practical advice on home loans, business funding, credit scores and more from the Growth Capital Services team.",
      },
      { property: "og:title", content: "Insights & Updates | Growth Capital Services" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const t = useInsightsText();
  const { pages, loaded } = useCustomPages();
  const posts = pages
    .filter((p) => p.kind === "post")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {t("hero.title")} <span className="gold-text-static italic">{t("hero.gold")}</span>
            </h1>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            {loaded ? t("empty") : "Loading…"}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to="/p/$slug"
                params={{ slug: p.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 dark:bg-card"
              >
                {p.image && (
                  <img src={`${CRM_API}${p.image}`} alt="" className="h-44 w-full object-cover" />
                )}
                <div className="p-5">
                  {p.date && (
                    <p className="text-xs font-semibold tracking-wide text-gold-dark uppercase">
                      {formatPageDate(p.date)}
                    </p>
                  )}
                  <h2 className="mt-1 text-lg font-extrabold text-navy dark:text-white">
                    {p.title}
                  </h2>
                  {p.summary && <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-gold-dark">
                    {t("readMore")} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
