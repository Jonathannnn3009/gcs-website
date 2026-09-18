import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator, LayoutGrid } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CASE_STUDIES, CASE_STUDY_GROUPS, type CaseStudyGroup } from "@/data/case-studies";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies | Growth Capital Services" },
      {
        name: "description",
        content:
          "Real lending scenarios GCS has structured — home loans, LAP, business funding, personal loans and education loans — the challenge, how it was routed, and the outcome.",
      },
      { property: "og:title", content: "Case Studies | Growth Capital Services" },
      {
        property: "og:description",
        content:
          "See how GCS structures loan applications that a first attempt elsewhere didn't clear.",
      },
    ],
  }),
  component: CaseStudiesPage,
});

type Filter = "All" | CaseStudyGroup;

function CaseStudiesPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () => (filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.group === filter)),
    [filter],
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <Reveal>
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <Link to="/" className="hover:text-navy dark:text-white">
                  Home
                </Link>
                <span className="text-gold">/</span>
                <span className="text-navy dark:text-white">Case Studies</span>
              </p>
              <p className="eyebrow mt-5">Real Scenarios</p>
              <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
                What stood in the way —<br />
                <span className="gold-text-static italic">and how we routed it.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                From a first rejection to a sanctioned loan — how we've structured real lending
                situations across our network of banks and NBFCs.
              </p>
            </Reveal>

            {/* Real illustration with a Ken-Burns drift and an About-page-style caption underneath */}
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/brand/case-story-home.png"
                  alt="Growth Capital Services — a family closing on their home loan"
                  className="kenburns w-full object-cover"
                />
              </div>
              <p className="mt-6 font-heading text-2xl leading-snug italic text-navy sm:text-3xl dark:text-white">
                "Every file here started with a no from somewhere else."
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The scenarios below show how we routed each one to a yes.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filter tabs — a real switch, not anchor jumps */}
      <section className="sticky top-[73px] z-30 border-b border-gold/10 bg-white/90 backdrop-blur-md dark:bg-card/90">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              filter === "All"
                ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                : "border-border bg-white text-navy hover:border-gold/40 dark:bg-card dark:text-white"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            All Cases
            <span className={filter === "All" ? "text-gold-light" : "text-gold-dark"}>
              {CASE_STUDIES.length}
            </span>
          </button>
          {CASE_STUDY_GROUPS.map((group) => {
            const count = CASE_STUDIES.filter((c) => c.group === group).length;
            const active = filter === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setFilter(group)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  active
                    ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                    : "border-border bg-white text-navy hover:border-gold/40 dark:bg-card dark:text-white"
                }`}
              >
                {group}
                <span className={active ? "text-gold-light" : "text-gold-dark"}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Case study grid — stat-forward cards, no index numerals */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div key={filter} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c, i) => (
            <Reveal key={c.slug} delay={i * 50} className="h-full">
              <Link
                to="/case-studies/$slug"
                params={{ slug: c.slug }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)] dark:bg-card"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-gold-pale/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-gold-dark uppercase">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                      <c.icon className="h-4 w-4" />
                    </span>
                    {c.group}
                  </span>
                  <span className="shrink-0 rounded-lg bg-navy px-2.5 py-1 font-heading text-sm font-bold text-gold-light">
                    {c.amountLabel}
                  </span>
                </div>

                <h3 className="relative mt-4 font-heading text-lg leading-snug font-bold text-navy dark:text-white">
                  {c.headline}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.clientProfile}
                </p>

                <span className="relative mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold text-navy transition-colors group-hover:text-gold-dark dark:text-white">
                  Read the case
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-dark transition-all duration-300 group-hover:w-[calc(100%-4.75rem)]" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                See what's <span className="gold-text">possible for your profile.</span>
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Tell an advisor your situation, and we'll tell you which lenders in our network fit
                it best.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/tools" hash="eligibility" className="gold-btn py-3.5 text-base">
                  <Calculator className="h-4 w-4" /> Check Your Eligibility
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5 dark:text-white"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366">
                    <path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
