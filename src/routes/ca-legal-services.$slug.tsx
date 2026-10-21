import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, FileText, ShieldCheck, Users } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ServiceEnquiryForm } from "@/components/service-enquiry-form";
import { ChecklistGate } from "@/components/checklist-gate";
import { CONTACT } from "@/data/site";
import {
  PROFESSIONAL_SERVICES,
  divisionLabel,
  getProfessionalService,
  type ServiceDetail,
} from "@/data/professional-services";
import { useProfessionalService } from "@/lib/site-content";
import { FactsStrip } from "@/components/facts-strip";

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
      <h1 className="mt-3 text-3xl font-extrabold text-navy dark:text-white">
        That service doesn't exist.
      </h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved — browse the full list instead.
      </p>
      <Link to="/ca-legal-services" className="gold-btn mt-6 inline-flex py-3">
        View all services <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

/** The fuller write-up some services carry: what it is, who needs it, the steps, every document, and why us. */
function DetailDossier({
  detail,
  slug,
  title,
}: {
  detail: ServiceDetail;
  slug: string;
  title: string;
}) {
  return (
    <>
      <div className="p-7 sm:p-9">
        <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl dark:text-white">
          {detail.heading}
        </h2>
        <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
          {detail.intro.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="p-7 sm:p-9">
        <p className="eyebrow flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {detail.whoHeading}
        </p>
        <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {detail.whoList.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
              {w}
            </li>
          ))}
        </ul>
        {detail.whoNote && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
            {detail.whoNote}
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="p-7 sm:p-9">
        <p className="eyebrow">How It Works</p>
        <div className="mt-5 space-y-5">
          {detail.steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <span className="font-heading shrink-0 text-2xl font-extrabold text-gold-dark">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-1">
                <p className="text-sm font-bold text-navy dark:text-white">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="p-7 sm:p-9">
        <p className="eyebrow flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Documents Required for {title}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {detail.documentsIntro}
        </p>
        <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {detail.documentGroups
            .slice(0, detail.shownGroups ?? detail.documentGroups.length)
            .map((g, i) => (
              // every group stays in the page and is only folded away, so all of it can be read and searched
              <details key={g.title} className="group" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-bold text-navy dark:text-white">
                    <span className="mr-2 text-gold-dark">{i + 1}.</span>
                    {g.title}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5">
                  {g.intro && <p className="text-sm text-muted-foreground">{g.intro}</p>}
                  <ul className="mt-2 space-y-2">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {g.after && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground italic">
                      {g.after}
                    </p>
                  )}
                </div>
              </details>
            ))}
        </div>
        {detail.documentsMore && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {detail.documentsMore}
          </p>
        )}
        <ChecklistGate
          pdfHref={`/checklists/${slug}-checklist.pdf`}
          productTitle={title}
          theme="light"
        />
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="p-7 sm:p-9">
        <p className="eyebrow flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Why Choose Our {title} Assistance?
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {detail.why.map((w) => (
            <div key={w.title} className="rounded-xl border border-border p-4">
              <p className="text-sm font-bold text-navy dark:text-white">{w.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="bg-gold-pale/25 p-7 sm:p-9 dark:bg-gold/5">
        <h3 className="font-heading text-lg font-bold text-navy dark:text-white">
          {detail.callout.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail.callout.body}</p>
        <a href="#enquire" className="gold-btn mt-5 py-3 text-sm">
          {detail.callout.cta} <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="bg-secondary/40 p-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="font-bold text-navy dark:text-white">Important:</strong>{" "}
        {detail.important}
      </div>
    </>
  );
}

function ProfessionalServiceDetailPage() {
  const { slug } = Route.useParams();
  const service = useProfessionalService(getProfessionalService(slug));
  if (!service) return <NotFoundBlock />;

  const similar = PROFESSIONAL_SERVICES.filter(
    (s) => s.category === service.category && s.slug !== service.slug,
  ).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
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
                  {divisionLabel(service.division)}
                </span>
              </div>

              <h1 className="relative mt-5 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                {service.summary}
              </p>

              <FactsStrip
                facts={[
                  { label: "Division", value: divisionLabel(service.division) },
                  { label: "Category", value: service.category },
                  {
                    label: "How it works",
                    value: `${service.detail ? service.detail.steps.length : service.process.length} steps`,
                  },
                  service.detail
                    ? {
                        label: "Full checklist",
                        value: `${service.detail.documentGroups.length} groups`,
                      }
                    : { label: "Documents", value: `${service.documents.length} items` },
                ]}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who needs it + process + documents — one continuous dossier panel */}
      <Section className="pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT: the dossier */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white dark:bg-card">
              {service.detail ? (
                <DetailDossier detail={service.detail} slug={service.slug} title={service.title} />
              ) : (
                <>
                  <div className="p-7 sm:p-9">
                    <p className="eyebrow flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> Who Needs This
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {service.whoNeedsIt}
                    </p>
                  </div>

                  <div className="border-t border-dashed border-border" />

                  <div className="p-7 sm:p-9">
                    <p className="eyebrow">How It Works</p>
                    <div className="mt-5 space-y-5">
                      {service.process.map((step, i) => (
                        <div key={step} className="flex gap-4">
                          <span className="font-heading shrink-0 text-2xl font-extrabold text-gold-dark">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-border" />

                  <div className="p-7 sm:p-9">
                    <p className="eyebrow flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Documents Typically Required
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {service.documents.map((doc) => (
                        <li
                          key={doc}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                    <ChecklistGate
                      pdfHref={`/checklists/${service.slug}-checklist.pdf`}
                      productTitle={service.title}
                      theme="light"
                    />
                  </div>
                </>
              )}

              <div className="bg-secondary/40 p-5 text-xs leading-relaxed text-muted-foreground">
                This service is arranged through our associated professionals —{" "}
                {service.division === "CA Services" ? "our CA Services team" : "our Professional Legal Services team"}{" "}
                — who handle the work through their own professional process. Requirements,
                documentation and timelines vary case to case.
              </div>
            </div>
          </Reveal>

          {/* RIGHT: sticky enquiry form */}
          <Reveal delay={100} className="scroll-mt-28 lg:sticky lg:top-28">
            <div id="enquire" className="scroll-mt-28" />
            <ServiceEnquiryForm
              heading={`Need Help With ${service.title}?`}
              description="Share your requirement and our team will connect you with the right professional."
              serviceTitle={service.title}
              showIncomeType={service.division === "CA Services"}
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
            <p className="eyebrow">More in {service.category}</p>
          </Reveal>
          <div className="mt-6 border-t border-border">
            {similar.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  to="/ca-legal-services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex items-center gap-4 border-b border-border py-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/70 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy dark:bg-gold/15">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-navy dark:text-white">
                      {s.title}
                    </span>
                    <span className="block text-sm text-muted-foreground">{s.summary}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
