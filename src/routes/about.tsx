import { createFileRoute, Link } from "@tanstack/react-router";
import { AboutTabs } from "@/components/about-tabs";
import { ArrowRight, ArrowUpRight, Eye, Landmark, SlidersHorizontal, UserCheck, Zap } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { CONTACT } from "@/data/site";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { ABOUT_PROCESS, ABOUT_STATS, ABOUT_WHY } from "@/data/page-lists";
import { useList } from "@/lib/page-lists";
import { useProductGroups } from "@/lib/page-lists";
import { useAboutText } from "@/lib/site-content";

// One animated icon beside each "why choose us" point, in the same order as the list.
const WHY_ICONS = [Landmark, UserCheck, Zap, Eye, SlidersHorizontal];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Growth Capital Services | Trusted Loan Experts Since 2017" },
      {
        name: "description",
        content:
          "Growth Capital Services, established in 2017, is a leading partnership firm offering custom-fit loan solutions from various Banks and NBFCs across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      { property: "og:title", content: "About Growth Capital Services" },
      {
        property: "og:description",
        content: "Your trusted loan facilitation partner. Since 2017.",
      },
    ],
  }),
  component: AboutPage,
});




function AboutPage() {
  const PROCESS = useList("about.process", ABOUT_PROCESS);
  const WHY_CHOOSE = useList("about.why", ABOUT_WHY);
  const PRODUCT_GROUPS = useProductGroups();
  const STATS = useList("about.stats", ABOUT_STATS);
  const t = useAboutText();
  // the company name is shown in bold where it starts the story
  const brand = "Growth Capital Services";
  const story1 = t("story.p1");
  const story1Brand = story1.startsWith(brand);
  return (
    <>
      <AboutTabs current="/about" />
      {/* Banner */}
      <section className="hero-light border-b border-gold/15 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Home <span className="text-gold">/</span> About
            </p>
            <p className="eyebrow mt-4">{t("banner.eyebrow")}</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {t("banner.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t("banner.body")}
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
            {STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-gold/40 pl-4">
                <p className="font-heading text-3xl font-bold text-navy sm:text-4xl dark:text-white">{s.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-gold-dark uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/brand/about-illustration.png"
                  alt="Growth Capital Services — turning aspirations into approvals"
                  className="w-full object-cover"
                />
              </div>
              <p className="mt-6 font-heading text-2xl leading-snug italic text-navy sm:text-3xl dark:text-white">
                {t("story.quote")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("story.quoteNote")}
              </p>
            </Reveal>

            <Reveal delay={100} className="lg:pt-4">
              <p className="eyebrow">{t("story.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
                {t("story.title")}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {story1Brand ? (
                  <>
                    <strong className="text-foreground">{brand}</strong>
                    {story1.slice(brand.length)}
                  </>
                ) : (
                  story1
                )}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t("story.p2")}
              </p>
              <Link
                to="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 dark:text-white"
              >
                {t("story.button")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/15 bg-white p-8 sm:p-14 dark:bg-card">
              <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-gold/8 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:divide-x lg:divide-border">
                <div className="lg:pr-10">
                  <p className="eyebrow">{t("mission.eyebrow")}</p>
                  <h3 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                    {t("mission.title")}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    {t("mission.body")}
                  </p>
                </div>
                <div className="lg:pl-10">
                  <p className="eyebrow">{t("vision.eyebrow")}</p>
                  <h3 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                    {t("vision.title")}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    {t("vision.body")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">{t("why.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
              {t("why.title")} <span className="gold-text-static italic">{t("why.gold")}</span>
            </h2>
          </Reveal>
          <div className="mt-12 border-t border-border">
            {WHY_CHOOSE.map((w, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-center sm:gap-10 sm:py-7">
                  <span className="font-heading shrink-0 text-2xl italic text-gold-dark sm:w-16">
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-navy dark:text-white">{w.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {w.body}
                    </p>
                  </div>
                  {(() => {
                    const Icon = WHY_ICONS[i % WHY_ICONS.length]!;
                    return (
                      <span
                        aria-hidden="true"
                        className="relative hidden shrink-0 sm:block"
                        style={{ animationDelay: `${i * 450}ms` }}
                      >
                        <span className="absolute inset-0 -m-3 rounded-full bg-gold/15 blur-xl transition-opacity duration-500 group-hover:bg-gold/30" />
                        <span
                          className="float-animation relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-[var(--shadow-card)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                          style={{ animationDelay: `${i * 450}ms` }}
                        >
                          <Icon className="h-7 w-7" />
                        </span>
                      </span>
                    );
                  })()}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">{t("services.eyebrow")}</p>
                <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
                  {t("services.title").replace("{count}", String(PRODUCTS.length))} <span className="gold-text-static italic">{t("services.gold")}</span>
                </h2>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-5 py-2.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 dark:text-white"
              >
                {t("services.button")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 space-y-10">
            {PRODUCT_GROUPS.map((group, gi) => (
              <Reveal key={group.name} delay={gi * 60}>
                <div className="flex items-center gap-3">
                  <p className="min-w-0 text-xs font-bold tracking-[0.14em] text-gold-dark uppercase sm:shrink-0">
                    {group.name}
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PRODUCTS.filter((p) => p.group === group.name).map((p) => (
                    <Link
                      key={p.slug}
                      to="/services/$slug"
                      params={{ slug: p.slug }}
                      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-soft-border hover:shadow-[var(--shadow-card)] dark:bg-card"
                    >
                      {/* soft blue that sweeps in from the left and fades out to the right on hover */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--blue-soft-border)_0%,var(--blue-soft)_55%,transparent_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100 dark:hidden"
                      />
                      <span className="relative text-[14px] font-bold text-foreground transition-transform duration-300 group-hover:translate-x-1">
                        {p.title}
                      </span>
                      <ArrowUpRight className="relative h-4 w-4 shrink-0 text-gold/60 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125 group-hover:text-gold-dark" />
                    </Link>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">{t("partners.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
              {t("partners.title")} <span className="gold-text-static italic">{t("partners.gold")}</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {t("partners.body")}
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <BankMarquee />
          </Reveal>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">{t("how.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
                {t("how.title")} <span className="gold-text-static italic">{t("how.gold")}</span>
              </h2>
            </div>
          </Reveal>
          {/* A spec-sheet row — no icons or shapes, just a clean divided strip */}
          <ol className="mt-14 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {PROCESS.map((step, i) => (
              <Reveal key={i} delay={i * 80}>
                <li className="p-6 text-center sm:p-5">
                  <span className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-2 text-base font-extrabold text-navy dark:text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
              <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{t("promise.label")}</p>
                <p className="mx-auto mt-5 max-w-xl font-heading text-2xl italic text-white sm:text-3xl">
                  {t("promise.quote")}
                </p>
                <p className="mt-4 text-sm text-white/60">
                  {t("promise.body")}
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link to="/contact" className="gold-btn py-3.5 text-base">
                    {t("promise.primary")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50"
                  >
                    {t("promise.secondary")}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
