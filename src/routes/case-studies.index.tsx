import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CASE_STUDIES, CASE_STUDY_GROUPS, type CaseStudyGroup } from "@/data/case-studies";
import { CONTACT } from "@/data/site";

const groupId = (group: CaseStudyGroup) => group.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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

function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy">
                Home
              </Link>
              <span className="text-gold">/</span>
              <span className="text-navy">Case Studies</span>
            </p>
            <p className="eyebrow mt-5">Real Scenarios</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl">
              What stood in the way —<br />
              <span className="gold-text-static italic">and how we routed it.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              From a first rejection to a sanctioned loan — how we've structured real lending
              situations across our network of banks and NBFCs.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {CASE_STUDY_GROUPS.map((group) => {
              const count = CASE_STUDIES.filter((c) => c.group === group).length;
              return (
                <a
                  key={group}
                  href={`#${groupId(group)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-white px-4 py-2 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold-pale/30"
                >
                  {group}
                  <span className="text-gold-dark">{count}</span>
                </a>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Case study groups */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-12">
          {CASE_STUDY_GROUPS.map((group, gi) => {
            const cases = CASE_STUDIES.filter((c) => c.group === group);
            return (
              <div key={group} id={groupId(group)} className="scroll-mt-24">
                <Reveal delay={gi * 80}>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                      {group}
                    </p>
                    <div className="h-px flex-1 origin-left scale-x-0 bg-border transition-transform delay-200 duration-700 ease-out group-data-[shown=true]/reveal:scale-x-100" />
                  </div>
                </Reveal>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cases.map((c, i) => (
                    <Reveal key={c.slug} delay={i * 60} className="h-full">
                      <Link
                        to="/case-studies/$slug"
                        params={{ slug: c.slug }}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-gold-pale/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative flex items-start justify-between gap-3">
                          <span className="font-heading text-3xl font-extrabold text-gold-dark">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out]">
                            <c.icon className="h-5 w-5" />
                          </span>
                        </div>

                        <p className="relative mt-4 text-[10px] font-bold tracking-[0.14em] text-gold-dark uppercase">
                          {c.category}
                        </p>
                        <h3 className="relative mt-2 font-heading text-lg leading-snug font-bold text-navy">
                          {c.headline}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                          {c.clientProfile}
                        </p>

                        <span className="relative mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold text-navy transition-colors group-hover:text-gold-dark">
                          Read the case
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-dark transition-all duration-300 group-hover:w-[calc(100%-4.75rem)]" />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-navy sm:text-3xl">
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
                  className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5"
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
