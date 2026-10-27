import { useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileText,
  Landmark,
  Layers,
  ListChecks,
  UserCheck,
  Wallet,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { ProductQuestionnaire } from "@/components/product-questionnaire";
import { questionnaireFor } from "@/data/product-questionnaires";
import { ChecklistGate } from "@/components/checklist-gate";
import { PRODUCTS, getProduct } from "@/data/products";
import { LOAN_PROCESS } from "@/data/loan-process";
import { ExpertNote } from "@/components/expert-note";
import { useProduct } from "@/lib/site-content";
import { FactsStrip } from "@/components/facts-strip";
import { CheckBadge, TopicHeader } from "@/components/topic-header";
import { ChargesBlock, NriBlock } from "@/components/product-extras";
import { useIntakeFields, withLoanAmount } from "@/lib/page-lists";
import { CONTACT, waLink } from "@/data/site";
import { PageCalculators } from "@/components/page-calculators";
import { PRODUCT_CALCULATORS } from "@/data/page-calculators";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const product = getProduct(params.slug);
    return {
      meta: product
        ? [
            { title: `${product.title} | Growth Capital Services` },
            { name: "description", content: product.about },
            { property: "og:title", content: `${product.title} | Growth Capital Services` },
            { property: "og:description", content: product.tagline },
          ]
        : [{ title: "Product Not Found | Growth Capital Services" }],
    };
  },
  component: ProductDetailPage,
});

function NotFoundBlock() {
  return (
    <Section className="text-center">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy dark:text-white">That product doesn't exist.</h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved — browse the full list instead.
      </p>
      <Link to="/services" className="gold-btn mt-6 inline-flex py-3">
        View all services <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

const PROCESS = [
  {
    num: "01",
    icon: FileText,
    title: "Tell Us What You Need",
    body: "A quick conversation about your goal and situation — no forms yet.",
  },
  {
    num: "02",
    icon: Landmark,
    title: "Lender Shortlist",
    body: "Your profile checked against our network to find who's actually likely to say yes.",
  },
  {
    num: "03",
    icon: FileCheck2,
    title: "Paperwork, Handled",
    body: "We prep the file the way this lender's underwriting desk expects to see it.",
  },
  {
    num: "04",
    icon: Check,
    title: "Funds, Then Follow-Up",
    body: "Money lands in your account — and we stay reachable well after that.",
  },
];

// Short names the team wants on the Apply button, where the automatic initials read wrongly.
const CODE_OVERRIDES: Record<string, string> = {
  "loan-against-property": "LAP",
  "micro-business-loan": "Micro Business Loan",
  "micro-lap": "Micro LAP",
  "loan-against-securities": "LAS",
  "balance-transfer": "BT & Top Up",
  dlod: "DL-OD",
  "unsecured-dod": "UOD",
  cgtmse: "CGTMSE",
  "cash-credit": "CC",
  "overdraft-limit": "OD",
  "bank-guarantee": "BG",
  "letter-of-credit": "LC",
  "bill-discounting": "BD",
};

// Products that were merged into another one: their old address goes to the new page.
const MERGED_INTO: Record<string, string> = {
  "loan-against-mutual-funds": "loan-against-securities",
  "working-capital": "working-capital-term-loan",
  "unsecured-term-loan": "working-capital-term-loan",
};

function productCode(title: string): string {
  const skip = new Set(["against", "and", "for", "of", "the", "on"]);
  return title
    .split(/\s+/)
    .filter((w) => !skip.has(w.toLowerCase()))
    .map((w) => w.match(/[A-Za-z]/)?.[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = useProduct(getProduct(slug));
  const intakeFields = withLoanAmount(useIntakeFields(slug, product?.checklistIntake));
  const [presetCategory, setPresetCategory] = useState<string | null>(null);
  useEffect(() => setPresetCategory(null), [slug]);
  if (MERGED_INTO[slug]) return <Navigate to="/services/$slug" params={{ slug: MERGED_INTO[slug]! }} replace />;
  if (!product) return <NotFoundBlock />;
  const related = PRODUCTS.filter((p) => p.group === product.group && p.slug !== product.slug);
  const fallbackRelated =
    related.length > 0 ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);
  const code = CODE_OVERRIDES[product.slug] ?? productCode(product.title);
  const questionnaire = questionnaireFor(product.slug);
  // the applicant type whose documents the panel shows: the one picked, otherwise the first
  const activeCategory =
    product.documentCategories?.find((c) => c.label === presetCategory) ??
    product.documentCategories?.[0];

  // "Do you qualify?" and the paperwork checklist download, shared by the full layout and by the
  // short layout of products that carry eligibility details.
  const qualifyBlock = product ? (
              <div>
                <div id="qualify" className="scroll-mt-28 p-7 sm:p-9">
                  <TopicHeader icon={UserCheck} title="Do you qualify?" />
                  <ul
                    className={`mt-6 grid gap-x-10 gap-y-3.5 ${product.eligibility.length > 4 ? "md:grid-cols-2" : ""}`}
                  >
                    {product.eligibility.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground"
                      >
                        <CheckBadge />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {product.documentCategories ? (
                    <div className="mt-8">
                      <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">
                        Which One Are You
                      </p>
                      {/* one row per applicant type: the name on the left, what it means on the right */}
                      <div className="mt-3 overflow-hidden rounded-xl border border-border">
                        {product.documentCategories.map((cat, i) => (
                          <div
                            key={cat.label}
                            className={`grid gap-1.5 bg-bg-light/50 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 dark:bg-white/5 ${
                              i > 0 ? "border-t border-border" : ""
                            }`}
                          >
                            <span className="text-sm font-bold text-navy dark:text-white">
                              {cat.label}
                            </span>
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {cat.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="navy-panel p-7 sm:p-9">
                  <TopicHeader icon={FileText} title="Paperwork you'll need" dark />

                  <div className="mt-2 grid gap-y-6">
                    <div>
                      {product.documentCategories ? (
                        <>
                          <div
                            className="mt-4 flex flex-wrap gap-1.5"
                            role="tablist"
                            aria-label="Applicant type"
                          >
                            {product.documentCategories.map((cat) => (
                              <button
                                key={cat.label}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory?.label === cat.label}
                                onClick={() => setPresetCategory(cat.label)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                                  activeCategory?.label === cat.label
                                    ? "border-gold bg-gold text-navy"
                                    : "border-white/20 text-white/60 hover:border-gold/40 hover:text-white"
                                }`}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                          {activeCategory ? (
                            <>
                              <p className="mt-5 text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                                For {activeCategory.label}
                              </p>
                              <ul className="mt-3 space-y-3">
                                {activeCategory.items.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-3 text-[14px] leading-relaxed text-white/75"
                                  >
                                    <CheckBadge dark />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : null}
                        </>
                      ) : (
                        <ul className="mt-4 space-y-3.5">
                          {product.documents.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-[15px] leading-relaxed text-white/75"
                            >
                              <CheckBadge dark />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div>
                      {product.documentCategories ? (
                        <>
                          <p className="mt-4 text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                            For Every Applicant
                          </p>
                          <ul className="mt-3 space-y-3">
                            {product.documents.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-[14px] leading-relaxed text-white/75"
                              >
                                <CheckBadge dark />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      <p className="mt-5 text-xs leading-relaxed text-white/50">
                        {product.documentCategories
                          ? "This is the usual list for each type of applicant. "
                          : ""}
                        Get the exact checklist for {product.title.toLowerCase()}, sent as a PDF you
                        can save or print.
                      </p>

                      <ChecklistGate
                    pdfHref={`/checklists/${product.slug}-checklist.pdf`}
                    pdfHrefByCategory={
                      product.slug === "home-loan"
                        ? {
                            Salaried: "/checklists/home-loan-salaried-checklist.pdf",
                            "Self-Employed": "/checklists/home-loan-self-employed-checklist.pdf",
                            NRI: "/checklists/home-loan-nri-checklist.pdf",
                          }
                        : undefined
                    }
                    productTitle={product.title}
                    productSlug={product.slug}
                    categories={product.documentCategories?.map((c) => c.label)}
                    presetCategory={activeCategory?.label ?? presetCategory}
                    onCategoryChange={setPresetCategory}
                    intakeFields={intakeFields}
                  />
                    </div>
                  </div>
                </div>
              </div>
  ) : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal animate={false}>
            <div className={`grid gap-0 overflow-hidden rounded-3xl ${
                product.facts.length >= 5
                  ? "lg:grid-cols-[2.9fr_1fr]"
                  : product.facts.length === 4
                    ? "lg:grid-cols-[2.3fr_1fr]"
                    : "lg:grid-cols-[1.4fr_1fr]"
              }`}>
              {/* Navy card */}
              <div className="navy-panel relative overflow-hidden p-8 sm:p-12">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
                <p className="relative flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                  <span className="text-gold">/</span>
                  <Link to="/services" className="hover:text-white">
                    Services
                  </Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">{product.title}</span>
                </p>

                <div className="relative mt-6 flex items-center gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/30 text-gold-light">
                    <product.icon className="h-7 w-7" />
                  </span>
                  <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-bold tracking-wide text-gold-light">
                    {code}
                  </span>
                </div>

                <h1 className="relative mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">
                  {product.title}
                </h1>
                {product.heroNote ? (
                  <p className="relative mt-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-bold tracking-wide text-gold-light uppercase">
                    {product.heroNote}
                  </p>
                ) : null}
                <p className="relative mt-2 font-heading text-lg italic text-gold-light">
                  {product.tagline}
                </p>

                <FactsStrip facts={product.facts} />

                <div className="relative mt-8 flex flex-wrap items-center gap-5">
                  {questionnaire ? (
                    <a
                      href="#apply"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="gold-btn py-3.5 text-base"
                    >
                      Apply for {code} <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link to="/contact" className="gold-btn py-3.5 text-base">
                      Apply for {code} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <a
                    href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
                  >
                    or message on WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* At-a-glance snapshot */}
              <div className="hidden flex-col justify-center gap-5 bg-gold-pale/40 p-8 lg:flex dark:bg-gold/10">
                <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
                  At A Glance
                </p>
                {product.glance ? (
                  <ul className="space-y-3">
                    {product.glance.map((g) => (
                      <li key={g.label} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                        <span className="text-sm leading-snug text-foreground">
                          <span className="font-bold text-navy dark:text-white">{g.label}:</span> {g.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : product.minimalDisclosure && product.eligibility.length > 0 ? (
                  // The terms are already in the strip on the left, so here show who the product is for.
                  <ul className="space-y-4">
                    {product.eligibility.slice(0, 5).map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                        <span className="text-sm leading-snug text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : product.minimalDisclosure ? (
                  <ul className="space-y-4">
                    {product.facts.map((fact) => (
                      <li key={fact.label} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                        <span className="text-sm leading-snug text-foreground">
                          <span className="font-bold text-navy dark:text-white">{fact.label}:</span> {fact.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-5">
                    {product.eligibility.slice(0, 5).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-gold-dark" />
                        <span className="text-[15px] leading-relaxed text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {(!product.minimalDisclosure || product.eligibility.length > 0) && (
                  <a
                    href="#qualify"
                    className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-gold-dark transition-colors hover:text-navy dark:hover:text-white"
                  >
                    {product.eligibility.length > 5
                      ? `See all ${product.eligibility.length} requirements`
                      : "See what you will need"}
                    <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The file — one continuous dossier panel instead of several stacked cards */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT: the dossier */}
          <Reveal animate={false}>
            <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white dark:bg-card">
              <div className="p-7 sm:p-9">
                <p className="eyebrow">The Short Version</p>
                <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
                  What {product.title} actually does for you.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {product.about}
                </p>
              </div>

              {product.minimalDisclosure ? (
                <>
                  {product.pullQuote ? (
                    <>
                      <div className="border-t border-dashed border-border" />
                      <div className="p-7 sm:p-9">
                        <p className="border-l-2 border-gold pl-4 text-base leading-relaxed font-medium text-navy italic dark:text-white">
                          "{product.pullQuote}"
                        </p>
                      </div>
                    </>
                  ) : null}

                  {product.features.length > 0 ? (
                    <>
                      <div className="border-t border-dashed border-border" />
                      <div className="p-7 sm:p-9">
                        <p className="eyebrow">Why Clients Choose This</p>
                        <ul className="mt-5 space-y-2.5">
                          {product.features.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}

                  {product.eligibility.length > 0 ? (
                    <>
                      <div className="border-t border-dashed border-border" />
                      {qualifyBlock}
                    </>
                  ) : null}

                  <div className="border-t border-dashed border-border" />
                  <div className="navy-panel p-7 text-center sm:p-9">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                      For More Information
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      Terms vary case to case — call or WhatsApp us and a senior expert will talk
                      you through the details directly.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <a href={CONTACT.phoneHref} className="gold-btn py-3 text-sm">
                        Call {CONTACT.phone} <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-5 py-3 text-sm font-bold text-white/80 transition-colors hover:border-gold/40 hover:text-white"
                      >
                        WhatsApp Us
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
              <div className="border-t border-dashed border-border" />

              <div className="p-7 sm:p-9">
                <TopicHeader icon={ListChecks} title="What's included" />
                <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {product.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground"
                    >
                      <CheckBadge />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {product.uses ? (
                <>
                  <div className="border-t border-dashed border-border" />
                  <div className="p-7 sm:p-9">
                    <TopicHeader icon={Wallet} title={product.uses.heading} />
                    <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {product.uses.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground">
                          <CheckBadge />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}

              {product.optionTiers ? (
                <>
                  <div className="border-t border-dashed border-border" />
                  <div className="p-7 sm:p-9">
                    <TopicHeader icon={Layers} title={product.optionTiers.heading} />
                    {product.optionTiers.intro ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.optionTiers.intro}</p>
                    ) : null}
                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      {product.optionTiers.tiers.map((tier) => (
                        <div key={tier.title} className="overflow-hidden rounded-xl border border-gold/25 bg-white dark:bg-card">
                          <p className="navy-panel px-4 py-3 text-sm font-extrabold text-gold-light">{tier.title}</p>
                          <dl className="divide-y divide-border px-4 text-[13px]">
                            {tier.points.map((pt) => (
                              <div key={pt.label} className="py-2.5">
                                <dt className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{pt.label}</dt>
                                <dd className="mt-0.5 leading-snug font-medium text-foreground">{pt.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              <div className="border-t border-dashed border-border" />

              {qualifyBlock}
              {product.charges ? <ChargesBlock charges={product.charges} /> : null}
              {product.nri ? <NriBlock nri={product.nri} /> : null}
                </>
              )}
            </div>
          </Reveal>

          {/* RIGHT: sticky apply card */}
          <Reveal animate={false} delay={100} className="lg:sticky lg:top-28">
            {questionnaire ? (
              <ProductQuestionnaire config={questionnaire} productSlug={product.slug} productTitle={product.title} />
            ) : (
              // On a short screen the form scrolls inside itself, with a scrollbar you can see, instead of running below the page
              <div className="gcs-scroll rounded-2xl pr-1 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain">
                <LeadForm defaultLoanType={product.title} source={`service-enquiry-${product.slug}`} />
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Why GCS, a next step, and the standard note on what depends on the lender */}
      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="rounded-2xl border border-blue-soft-border bg-blue-soft p-7 sm:p-9 dark:border-gold/15 dark:bg-card">
            <p className="eyebrow">Why Growth Capital Services</p>
            <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              One conversation, many lenders to compare.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {product.whyGcs ??
                "We are a loan consultant, not the lender. We help you compare options from 75+ Banks and NBFCs, prepare your documents, and follow your application through each step."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/tools" hash="eligibility" className="gold-btn py-3 text-sm">
                Check Your Eligibility <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn dark:bg-card dark:text-white"
              >
                Talk to Our Loan Expert
              </a>
            </div>
            <p className="mt-6 border-t border-dashed border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-navy dark:text-white">Important note: </span>
              {product.importantNote ??
                "Interest rate, loan amount, tenure, charges, eligibility, approval and disbursement depend on the policy of the respective Bank or NBFC, your profile, credit assessment and the applicable terms. Growth Capital Services is a loan consultant and does not lend money itself. The details on this page are for general information."}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Calculators that suit this loan */}
      {(PRODUCT_CALCULATORS[product.slug] ?? []).length > 0 && (
        <PageCalculators
          ids={PRODUCT_CALCULATORS[product.slug] ?? []}
          eyebrow="Run the numbers"
          title={`Calculators for your ${product.title}`}
          description="Try your own figures before you apply — nothing is saved or sent."
        />
      )}

      {/* Process */}
      {(() => {
        const guide = LOAN_PROCESS[product.slug];
        if (!guide) {
          return (
            <Section className="pt-0">
              <Reveal animate={false}>
                <SectionHeading
                  eyebrow="Our Process"
                  title="From first conversation to disbursal."
                  align="center"
                />
              </Reveal>
              <div className="relative mt-14">
                <span
                  aria-hidden
                  className="absolute top-5 right-[10%] left-[10%] hidden h-0.5 bg-gold/20 lg:block"
                />
                <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {PROCESS.map((step, i) => (
                    <Reveal animate={false} key={step.num} delay={i * 80}>
                      <li className="text-center">
                        <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-gold-dark dark:bg-card">
                          <step.icon className="h-4 w-4" />
                        </span>
                        <h4 className="mt-4 text-base font-extrabold text-navy dark:text-white">{step.title}</h4>
                        <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </Section>
          );
        }
        const cols = guide.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";
        return (
          <Section className="pt-0">
            <Reveal animate={false}>
              <SectionHeading
                eyebrow="Step-by-step guide"
                title={`${product.title} process, step by step.`}
                description={guide.intro}
                align="center"
              />
            </Reveal>
            <ol className={`mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 ${cols}`}>
              {guide.steps.map((step, i) => (
                <Reveal animate={false} key={step.title} delay={i * 70}>
                  <li className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 text-center shadow-sm dark:bg-card">
                    <span className="font-heading text-5xl leading-none font-extrabold text-gold-dark">
                      {i + 1}
                    </span>
                    <span aria-hidden className="mx-auto mt-3 h-0.5 w-8 rounded bg-gold" />
                    <h4 className="mt-4 text-base font-extrabold text-navy dark:text-white">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
            <ExpertNote className="mt-8">
              With GCS, your expert looks at your profile, matches it with suitable lenders, and
              coordinates with the banks for you. That means less confusion and more confidence when
              you apply.
            </ExpertNote>
          </Section>
        );
      })()}

      {/* Related products */}
      <Section className="pt-0">
        <Reveal animate={false}>
          <SectionHeading
            eyebrow="Worth Comparing"
            title={`The rest of ${product.group}`}
            description={`So you can weigh ${product.title} against everything else we arrange in this category before deciding.`}
          />
        </Reveal>
        <div className="mt-8 border-t border-border">
          {fallbackRelated.map((p, i) => (
            <Reveal animate={false} key={p.slug} delay={i * 60}>
              <Link
                to="/services/$slug"
                params={{ slug: p.slug }}
                className="group flex items-center gap-4 border-b border-border py-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy dark:bg-gold/15">
                  <p.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold text-navy dark:text-white">{p.title}</span>
                  <span className="block text-sm text-muted-foreground">{p.tagline}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal animate={false} delay={200} className="mt-6 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark dark:text-white"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Still deciding on {product.title}? <span className="gold-text">Ask us directly.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Request a Call Back <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn dark:bg-card dark:text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
