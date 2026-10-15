import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Handshake,
  ListChecks,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/cibil-advisory")({
  head: () => ({
    meta: [
      { title: "CIBIL Advisory Services | Growth Capital Services" },
      {
        name: "description",
        content:
          "Understand your credit report and score with our experts. For individuals and business owners (MSMEs): read your report, spot errors, plan your next steps and get ready to apply for a loan.",
      },
      { property: "og:title", content: "CIBIL Advisory Services" },
      {
        property: "og:description",
        content: "Understand your credit report, plan your next steps and get ready for a loan.",
      },
    ],
  }),
  component: CibilAdvisoryPage,
});

const HELPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileSearch,
    title: "Credit report review",
    text: "We go through your credit report with you and explain it in simple words, including what lenders see.",
  },
  {
    icon: Gauge,
    title: "Understanding your score",
    text: "Learn what affects your CIBIL score, and which things may have helped or hurt it.",
  },
  {
    icon: SearchCheck,
    title: "Spotting errors",
    text: "We help you spot mistakes, such as a wrong account or a wrong status, and guide you on how to ask the bureau or lender to correct them.",
  },
  {
    icon: Wallet,
    title: "Dues and closed accounts",
    text: "Guidance on overdue, settled or closed accounts, and the steps that may help your profile over time.",
  },
  {
    icon: Building2,
    title: "CMR for businesses",
    text: "For MSMEs: understand your CIBIL MSME Rank (CMR) and what lenders look at in a business credit report.",
  },
  {
    icon: ListChecks,
    title: "A step-by-step plan",
    text: "A simple action plan for you: what to pay first, how much credit to use, and when to apply for new credit.",
  },
  {
    icon: ClipboardCheck,
    title: "Loan readiness",
    text: "Get your profile and documents ready before you apply, so that you approach suitable lenders with more confidence.",
  },
  {
    icon: Handshake,
    title: "Loan support",
    text: "When you are ready, we compare loan options from 75+ Banks and NBFCs and guide you through the application.",
  },
];

const AUDIENCE: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UserCheck, title: "Salaried people", text: "Planning a home, car or personal loan and want to know where they stand." },
  { icon: Briefcase, title: "Business owners", text: "Self-employed and professionals who need credit for their work." },
  { icon: Building2, title: "MSMEs", text: "Small and medium businesses who want to understand their business credit report." },
  { icon: ShieldCheck, title: "Anyone turned down", text: "People whose loan was declined and who want to know why, and what to do next." },
];

const STEPS = [
  { title: "Share your details", text: "Tell us a little about yourself and what you need. We ask for your consent first." },
  { title: "Review your report", text: "We go through your credit report together and mark what matters." },
  { title: "Get your plan", text: "You get a clear list of next steps, in simple words." },
  { title: "Check your options", text: "When you are ready, we compare loan options that may suit your profile." },
];

function CibilAdvisoryPage() {
  return (
    <>
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal animate={false}>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 sm:p-12">
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
              <div className="relative">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                  <span className="text-gold">/</span>
                  <Link to="/cibil" className="hover:text-white">
                    CIBIL
                  </Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">CIBIL Advisory Services</span>
                </p>
                <p className="eyebrow mt-5">CIBIL Advisory Services</p>
                <h1
                  className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                >
                  Understand your credit. <span className="gold-text">Improve it, step by step.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70">
                  Your credit report decides how lenders see you. Our experts help individuals and business owners
                  read their report, spot problems and make a clear plan before they apply for a loan.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a href="#talk" className="gold-btn py-3 text-sm">
                    Request a Call Back <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-bold text-white/85 transition-colors hover:border-gold/40 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-gold" /> Talk to Our Loan Expert
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="How We Can Help"
            title="From reading your report to getting loan-ready."
            description="Many people only look at their score. We look at the whole report, and help you decide what to do next."
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HELPS.map((h, i) => (
            <Reveal key={h.title} delay={i * 40}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark dark:bg-gold/15">
                  <h.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="Who It Is For" title="Whether you are an individual or a business." align="center" />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 40}>
              <div className="h-full rounded-2xl border border-gold/15 bg-gold-pale/15 p-6">
                <a.icon className="h-6 w-6 text-gold-dark" />
                <h3 className="mt-3 text-base font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="How It Works" title="Four simple steps." align="center" />
        </Reveal>
        <ol className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <li className="h-full rounded-2xl border border-border bg-white p-6 dark:bg-card">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-sm font-bold text-gold-light">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="pt-0" id="talk">
        <div className="grid gap-8 rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 lg:grid-cols-[1fr_480px] lg:items-stretch">
          <Reveal>
            <p className="eyebrow">Talk to Us</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Better credit health helps <span className="gold-text">every loan you apply for.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              A clear credit report can make your cash flow easier to plan, give lenders more confidence in you, and
              help you avoid surprises when you apply. Share your details and a loan expert will call you back.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cibil" className="outline-btn dark:bg-card dark:text-white">
                Get your credit report
              </Link>
              <Link to="/credit-score-estimator" className="outline-btn dark:bg-card dark:text-white">
                Try the score estimator
              </Link>
            </div>
            <p className="mt-6 border-t border-dashed border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-navy dark:text-white">Important note: </span>
              Growth Capital Services is a loan consultant. We are not a credit bureau or a lender. Only the credit
              bureau and the lender can correct or change what is in your report, after their own checks. We cannot
              promise a change in your score or the approval of a loan. Results depend on your credit history, your
              profile and each lender&apos;s policy.
            </p>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <LeadForm defaultLoanType="Other" source="cibil-advisory" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
