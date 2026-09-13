import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { PROFESSIONAL_SERVICES, SERVICE_DIVISIONS, type ServiceDivision } from "@/data/professional-services";

const divisionId = (division: ServiceDivision) => division.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const Route = createFileRoute("/ca-legal-services/")({
  head: () => ({
    meta: [
      { title: "CA & Legal Services | Growth Capital Services" },
      {
        name: "description",
        content:
          "Tax, GST, accounting and business registration through our associated CA Services team, and property, society, SRA/MHADA/MMRDA and legal documentation through Sheetal Associates.",
      },
      { property: "og:title", content: "CA & Legal Services | Growth Capital Services" },
      {
        property: "og:description",
        content: "Professional CA and legal documentation support, alongside your loan requirements.",
      },
    ],
  }),
  component: CaLegalServicesPage,
});

function CaLegalServicesPage() {
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
              <span className="text-navy">CA & Legal Services</span>
            </p>
            <p className="eyebrow mt-5">Beyond Your Loan</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl">
              Tax, Compliance &<br />
              <span className="gold-text-static italic">Legal Documentation, Sorted.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Alongside our loan business, we connect you with our associated professionals — our
              CA Services team for tax, GST and business compliance, and Sheetal Associates for
              property and legal documentation — each handling the work through their own
              professional process, with GCS as your single point of contact.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {SERVICE_DIVISIONS.map(({ division }) => {
              const count = PROFESSIONAL_SERVICES.filter((s) => s.division === division).length;
              return (
                <a
                  key={division}
                  href={`#${divisionId(division)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-white px-4 py-2 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold-pale/30"
                >
                  {division}
                  <span className="text-gold-dark">{count}</span>
                </a>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Divisions */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-16">
          {SERVICE_DIVISIONS.map(({ division, categories }, di) => (
            <div key={division} id={divisionId(division)} className="scroll-mt-24">
              <Reveal delay={di * 80}>
                <p className="eyebrow">{division}</p>
                <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
                  {division === "CA Services"
                    ? "Tax, GST, accounting and business registration."
                    : "Property, society and legal documentation."}
                </h2>
              </Reveal>

              <div className="mt-8 space-y-10">
                {categories.map((category, ci) => {
                  const services = PROFESSIONAL_SERVICES.filter(
                    (s) => s.division === division && s.category === category,
                  );
                  if (services.length === 0) return null;
                  return (
                    <div key={category}>
                      <Reveal delay={ci * 60}>
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                            {category}
                          </p>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                      </Reveal>
                      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s, i) => (
                          <Reveal key={s.slug} delay={i * 60} className="h-full">
                            <Link
                              to="/ca-legal-services/$slug"
                              params={{ slug: s.slug }}
                              className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-white p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]"
                            >
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                                <s.icon className="h-5 w-5" />
                              </span>
                              <div>
                                <h3 className="font-heading text-base leading-snug font-bold text-navy">
                                  {s.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                  {s.summary}
                                </p>
                              </div>
                              <span className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-bold text-navy transition-colors group-hover:text-gold-dark">
                                Learn more
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                              </span>
                            </Link>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Enquiry */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <Reveal>
            <p className="eyebrow">Not Sure Where to Start?</p>
            <h3 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Tell us what you need — <span className="gold-text">we'll point you right.</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Whether it's a tax filing, a GST question or a property document, share your
              requirement and our team will connect you with the right associated professional.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ServiceEnquiryForm
              heading="Get Professional Assistance"
              description="Share your requirement and our team will guide you on the next steps."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
