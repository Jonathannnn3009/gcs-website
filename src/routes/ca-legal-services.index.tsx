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
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy dark:text-white">
                Home
              </Link>
              <span className="text-gold">/</span>
              <span className="text-navy dark:text-white">CA & Legal Services</span>
            </p>
            <p className="eyebrow mt-5">Beyond Your Loan</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-white px-4 py-2 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold-pale/30 dark:bg-card dark:text-white dark:hover:bg-gold/15"
                >
                  {division}
                  <span className="text-gold-dark">{count}</span>
                </a>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Divisions — each gets its own visual identity since they're two different practices */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-10">
          {SERVICE_DIVISIONS.map(({ division }, di) => {
            const services = PROFESSIONAL_SERVICES.filter((s) => s.division === division);
            const isLegal = division === "Sheetal Associates";
            return (
              <Reveal key={division} delay={di * 80}>
                <div
                  id={divisionId(division)}
                  className={`scroll-mt-24 rounded-3xl border p-6 sm:p-10 ${
                    isLegal ? "border-navy/15 bg-white dark:bg-card" : "border-gold/20 bg-gold-pale/15"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="eyebrow">{division}</p>
                      <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                        {isLegal
                          ? "Property, society and legal documentation."
                          : "Tax, GST, accounting and business registration."}
                      </h2>
                    </div>
                    <span className="text-xs font-bold tracking-wide text-muted-foreground">
                      {services.length} services
                    </span>
                  </div>

                  <div className="mt-8 border-t border-border/70">
                    {services.map((s, i) => (
                      <Reveal key={s.slug} delay={i * 40}>
                        <Link
                          to="/ca-legal-services/$slug"
                          params={{ slug: s.slug }}
                          className="group flex items-center gap-4 border-b border-border/70 py-4"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-gold-dark ring-1 ring-gold/20 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy dark:bg-card">
                            <s.icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-baseline gap-x-2">
                              <span className="text-base font-bold text-navy dark:text-white">{s.title}</span>
                              <span className="text-[10px] font-bold tracking-wide text-gold-dark uppercase">
                                {s.category}
                              </span>
                            </span>
                            <span className="block text-sm text-muted-foreground">
                              {s.summary}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA / Enquiry */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <Reveal>
            <p className="eyebrow">Not Sure Where to Start?</p>
            <h3 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
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
