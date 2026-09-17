import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Calculator, Compass, MapPin, Trophy } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CASE_STUDIES, getCaseStudy, type CaseStudy } from "@/data/case-studies";
import { getProduct } from "@/data/products";
import { waLink } from "@/data/site";

export const Route = createFileRoute("/case-studies/$slug")({
  head: ({ params }) => {
    const study = getCaseStudy(params.slug);
    return {
      meta: study
        ? [
            { title: `${study.headline} | Growth Capital Services` },
            { name: "description", content: study.outcome },
            { property: "og:title", content: `${study.headline} | Growth Capital Services` },
            { property: "og:description", content: study.clientProfile },
          ]
        : [{ title: "Case Study Not Found | Growth Capital Services" }],
    };
  },
  component: CaseStudyDetailPage,
});

function NotFoundBlock() {
  return (
    <Section className="text-center">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">That case study doesn't exist.</h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved — browse the full list instead.
      </p>
      <Link to="/case-studies" className="gold-btn mt-6 inline-flex py-3">
        View all case studies <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

const STAGES = [
  {
    key: "challenge" as const,
    icon: AlertTriangle,
    label: "The Challenge",
    eyebrow: "What stood in the way",
  },
  {
    key: "structuring" as const,
    icon: Compass,
    label: "The Structuring",
    eyebrow: "How we routed it",
  },
  { key: "outcome" as const, icon: Trophy, label: "The Outcome", eyebrow: "Where it landed" },
];

/** Click-through stepper replacing a plain read-down list — same three facts, revealed on demand. */
function NarrativeStepper({ study }: { study: CaseStudy }) {
  const [active, setActive] = useState(0);
  const stage = STAGES[active] ?? STAGES[0]!;

  return (
    <div>
      <div className="flex gap-2 rounded-2xl border border-border bg-white p-1.5 shadow-[var(--shadow-card)]">
        {STAGES.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-300 sm:text-sm ${
                isActive
                  ? "bg-navy text-white shadow-[var(--shadow-card)]"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-navy"
              }`}
            >
              <s.icon className={`h-4 w-4 ${isActive ? "text-gold-light" : "text-gold-dark"}`} />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className="rise-in mt-6 rounded-2xl border border-gold/15 bg-white p-7 shadow-[var(--shadow-card)] sm:p-8"
      >
        <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
          {stage.eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-navy">{stage.label}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{study[stage.key]}</p>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            disabled={active === 0}
            onClick={() => setActive((v) => Math.max(0, v - 1))}
            className="text-xs font-bold text-navy transition-colors disabled:pointer-events-none disabled:opacity-30"
          >
            ← Back
          </button>
          <div className="flex gap-1.5">
            {STAGES.map((s, i) => (
              <span
                key={s.key}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-gold" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={active === STAGES.length - 1}
            onClick={() => setActive((v) => Math.min(STAGES.length - 1, v + 1))}
            className="text-xs font-bold text-navy transition-colors disabled:pointer-events-none disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function CaseStudyDetailPage() {
  const { slug } = Route.useParams();
  const study = getCaseStudy(slug);
  if (!study) return <NotFoundBlock />;

  const product = getProduct(study.productSlug);
  const similar = CASE_STUDIES.filter(
    (c) => c.group === study.group && c.slug !== study.slug,
  ).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-light py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl navy-panel relative p-8 sm:p-12">
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />

              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                    <Link to="/" className="hover:text-white">
                      Home
                    </Link>
                    <span className="text-gold">/</span>
                    <Link to="/case-studies" className="hover:text-white">
                      Case Studies
                    </Link>
                    <span className="text-gold">/</span>
                    <span className="text-white">{study.productLabel}</span>
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/30 text-gold-light">
                      <study.icon className="h-7 w-7" />
                    </span>
                    <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-bold tracking-wide text-gold-light">
                      {study.category}
                    </span>
                  </div>

                  <h1 className="mt-5 max-w-2xl font-heading text-3xl font-bold text-white sm:text-4xl">
                    {study.headline}
                  </h1>
                </div>

                {/* Amount as a standalone receipt-style chip instead of an inline stat row */}
                <div className="shrink-0 rounded-2xl border border-gold/25 bg-white/5 px-6 py-4 text-center backdrop-blur-sm">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                    Sanctioned
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-gold-light">
                    {study.amountLabel}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-white/60">
                    {study.productLabel}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Client profile + interactive narrative stepper */}
      <Section className="pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT: narrative */}
          <div className="space-y-8">
            <Reveal>
              <p className="eyebrow flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Client Profile
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {study.clientProfile}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <NarrativeStepper study={study} />
            </Reveal>

            <Reveal>
              <div className="flex items-start gap-4 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold-pale/40 via-white to-white p-6 sm:p-7">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-gold-light">
                  <Compass className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
                    A Working Promise
                  </p>
                  <p className="mt-2 font-heading text-lg leading-snug italic text-navy">
                    "One advisor reviews your file, matches you with the lender most likely to fit
                    your profile, and stays with your case through to disbursal."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: sticky CTA card, then a scene illustration filling the space beneath it */}
          <div className="space-y-6">
            <Reveal delay={100} className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-gold/15 panel-light p-7">
                <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                  Have a Similar Profile?
                </p>
                <h3 className="mt-3 font-heading text-2xl font-bold text-navy">
                  Explore <span className="italic text-gold-dark">{study.productLabel}.</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  A senior advisor will review your situation and tell you which lenders in our
                  network are the best fit — free of cost.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {product && (
                    <Link
                      to="/services/$slug"
                      params={{ slug: product.slug }}
                      className="gold-btn justify-center py-3.5 text-sm"
                    >
                      {product.title} Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    to="/tools"
                    hash="eligibility"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-navy/20 px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5"
                  >
                    <Calculator className="h-4 w-4" /> Check Your Eligibility
                  </Link>
                  <a
                    href={waLink(
                      `Hi, I have a situation similar to "${study.headline}" — could you help me explore ${study.productLabel} options?`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="overflow-hidden rounded-2xl">
                <img src={study.image} alt={study.headline} className="w-full object-cover" />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Illustrative — anonymized scenario, not the actual client.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Similar case studies */}
      {similar.length > 0 && (
        <Section className="pt-0">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Similar Case Studies
            </p>
          </Reveal>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60} className="h-full">
                <Link
                  to="/case-studies/$slug"
                  params={{ slug: c.slug }}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] text-gold-dark uppercase">
                      {c.category}
                    </p>
                    <p className="mt-1.5 font-heading text-base leading-snug font-bold text-navy">
                      {c.headline}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-bold text-navy transition-colors group-hover:text-gold-dark">
                    Read the case
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
