import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileText, Users } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { CONTACT } from "@/data/site";
import { PROFESSIONAL_SERVICES, getProfessionalService } from "@/data/professional-services";

export const Route = createFileRoute("/ca-legal-services/$slug")({
  head: ({ params }) => {
    const service = getProfessionalService(params.slug);
    return {
      meta: service
        ? [
            { title: `${service.title} | Growth Capital Services` },
            { name: "description", content: service.summary },
            { property: "og:title", content: `${service.title} | Growth Capital Services` },
            { property: "og:description", content: service.summary },
          ]
        : [{ title: "Service Not Found | Growth Capital Services" }],
    };
  },
  component: ProfessionalServiceDetailPage,
});

function NotFoundBlock() {
  return (
    <Section className="text-center">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">That service doesn't exist.</h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved — browse the full list instead.
      </p>
      <Link to="/ca-legal-services" className="gold-btn mt-6 inline-flex py-3">
        View all services <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

function ProfessionalServiceDetailPage() {
  const { slug } = Route.useParams();
  const service = getProfessionalService(slug);
  if (!service) return <NotFoundBlock />;

  const similar = PROFESSIONAL_SERVICES.filter(
    (s) => s.category === service.category && s.slug !== service.slug,
  ).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-light py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl navy-panel relative p-8 sm:p-12">
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />

              <p className="relative flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
                <span className="text-gold">/</span>
                <Link to="/ca-legal-services" className="hover:text-white">
                  CA & Legal Services
                </Link>
                <span className="text-gold">/</span>
                <span className="text-white">{service.category}</span>
              </p>

              <div className="relative mt-6 flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/30 text-gold-light">
                  <service.icon className="h-7 w-7" />
                </span>
                <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-bold tracking-wide text-gold-light">
                  {service.division}
                </span>
              </div>

              <h1 className="relative mt-5 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                {service.summary}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who needs it + process + documents */}
      <Section className="pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT */}
          <div className="space-y-10">
            <Reveal>
              <p className="eyebrow flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Who Needs This
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {service.whoNeedsIt}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="eyebrow">How It Works</p>
              <div className="mt-4 space-y-5">
                {service.process.map((step, i) => (
                  <div key={step} className="flex gap-4">
                    <span className="font-heading shrink-0 text-2xl font-extrabold text-gold-dark">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140}>
              <p className="eyebrow flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Documents Typically Required
              </p>
              <ul className="mt-4 space-y-2.5">
                {service.documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    {doc}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
              This service is arranged through our associated professionals —{" "}
              {service.division === "CA Services" ? "our CA Services team" : "Sheetal Associates"}{" "}
              — who handle the work through their own professional process. Requirements,
              documentation and timelines vary case to case.
            </div>
          </div>

          {/* RIGHT: sticky enquiry form */}
          <Reveal delay={100} className="lg:sticky lg:top-28">
            <ServiceEnquiryForm
              heading={`Need Help With ${service.title}?`}
              description="Share your requirement and our team will connect you with the right professional."
              serviceTitle={service.title}
            />
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Prefer to talk it through? Call {CONTACT.phone} or{" "}
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gold-dark hover:underline"
              >
                WhatsApp us
              </a>
              .
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Similar services */}
      {similar.length > 0 && (
        <Section className="pt-0">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              More in {service.category}
            </p>
          </Reveal>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60} className="h-full">
                <Link
                  to="/ca-legal-services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="mt-1.5 font-heading text-base leading-snug font-bold text-navy">
                      {s.title}
                    </p>
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
        </Section>
      )}
    </>
  );
}
