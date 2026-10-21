import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { CONTACT } from "@/data/site";
import { Reveal } from "@/components/reveal";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { PROFESSIONAL_SERVICES, SERVICE_DIVISIONS, divisionLabel, type ServiceDivision } from "@/data/professional-services";
import { useProfessionalServices } from "@/lib/site-content";
import { categoryAnchor } from "@/data/ca-legal-menu";

const divisionId = (division: ServiceDivision) => division.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const Route = createFileRoute("/ca-legal-services/")({
  head: () => ({
    meta: [
      { title: "CA & Legal Services | Growth Capital Services" },
      {
        name: "description",
        content:
          "Tax, GST, accounting and business registration through our associated CA Services team, and property, society, SRA/MHADA/MMRDA and legal documentation through our Professional Legal Services team.",
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
  const allServices = useProfessionalServices(PROFESSIONAL_SERVICES);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
              CA Services team for tax, GST and business compliance, and our Professional Legal Services team for
              property and legal documentation — each handling the work through their own
              professional process, with GCS as your single point of contact.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {SERVICE_DIVISIONS.map(({ division }) => {
              const count = allServices.filter((s) => s.division === division).length;
              return (
                <a
                  key={division}
                  href={`#${divisionId(division)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-white px-4 py-2 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold-pale/30 dark:bg-card dark:text-white dark:hover:bg-gold/15"
                >
                  {divisionLabel(division)}
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
            const services = allServices.filter((s) => s.division === division);
            const isLegal = division === "Sheetal Associates";
            return (
              <Reveal key={division} delay={di * 80}>
                <div
                  id={divisionId(division)}
                  className={`scroll-mt-24 rounded-3xl border p-6 sm:p-10 ${
                    isLegal ? "border-navy/15 bg-white dark:bg-card" : "border-gold/20 bg-gold-pale/15"
                  }`}
                >
                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <img
                      src={isLegal ? "/illustrations/legal-counsel.webp" : "/illustrations/ca-services.webp"}
                      alt={
                        isLegal
                          ? "A lawyer explaining documents to a family, with a court building and the scales of justice behind them"
                          : "A chartered accountant reviewing accounts and charts at her desk"
                      }
                      width={isLegal ? 1438 : 1024}
                      height={isLegal ? 1094 : 1024}
                      loading="lazy"
                      className={`mx-auto aspect-[4/3] w-full max-w-xl rounded-2xl object-cover shadow-[var(--shadow-card)] ${
                        isLegal ? "lg:order-2" : ""
                      }`}
                    />
                    <div className={isLegal ? "lg:order-1" : ""}>
                      <p className="eyebrow">{divisionLabel(division)}</p>
                      <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                        {isLegal
                          ? "Property, society and legal documentation."
                          : "Tax, GST, accounting and business registration."}
                      </h2>
                      <p className="mt-4 text-sm font-bold text-navy dark:text-white">
                        What's included · {services.length} services
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link
                              to="/ca-legal-services/$slug"
                              params={{ slug: s.slug }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-gold hover:bg-gold-pale/40 dark:bg-card dark:text-white"
                            >
                              <s.icon className="h-3.5 w-3.5 text-gold-dark" />
                              {s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border/70">
                    {services.map((s, i) => (
                      <Reveal key={s.slug} delay={i * 40}>
                        <Link
                          to="/ca-legal-services/$slug"
                          params={{ slug: s.slug }}
                          {...(i === 0 || services[i - 1]?.category !== s.category
                            ? { id: categoryAnchor(s.category) }
                            : {})}
                          className="group flex scroll-mt-24 items-center gap-4 border-b border-border/70 py-4"
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
        <div className="grid gap-8 rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 lg:grid-cols-[1fr_480px] lg:items-stretch">
          <Reveal className="flex h-full flex-col">
            <p className="eyebrow">Not Sure Where to Start?</p>
            <h3 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Tell us what you need — <span className="gold-text">we'll point you right.</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Whether it's a tax filing, a GST question or a property document, share your
              requirement and our team will connect you with the right associated professional.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                ["Tell us what you need", "A few words are enough. A tax filing, a GST question or a property document."],
                ["We connect you", "Our team matches you with the right CA or legal professional."],
                ["You get clear next steps", "You are told what documents are needed and how the work will go."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-base font-bold text-navy dark:text-white">{title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-dashed border-gold/30 pt-6 lg:mt-auto">
              <a href={CONTACT.phoneHref} className="gold-btn px-5 py-3 text-sm">
                <Phone className="h-4 w-4" /> Call {CONTACT.phone}
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn dark:bg-card dark:text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <ServiceEnquiryForm
              roomy
              heading="Get Professional Assistance"
              description="Share your requirement and our team will guide you on the next steps."
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
