import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Globe,
  Landmark,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { MissionVision } from "@/components/mission-vision";
import { LoanGoals } from "@/components/loan-goals";
import { ConcernCards } from "@/components/concern-cards";
import { BankMarquee } from "@/components/bank-marquee";
import { LeadForm } from "@/components/lead-form";
import { ConsultationBackdrop } from "@/components/consultation-backdrop";
import { EmiCalculator } from "@/components/emi-calculator";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growth Capital Services | Loan Experts in Mumbai, Thane & Pune" },
      {
        name: "description",
        content:
          "Tailored home, property, business and personal loan solutions from leading Banks and NBFCs. Trusted loan advisors since 2017 across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      {
        property: "og:title",
        content: "Growth Capital Services | Where Capital Meets Opportunity",
      },
      {
        property: "og:description",
        content:
          "Your growth, our financial expertise. Zero-hassle loan solutions from major Banks and NBFCs.",
      },
    ],
  }),
  component: HomePage,
});

const WA_PATH =
  "M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z";

const HERO_POINTS = [
  { icon: BadgeCheck, title: "Every Loan Type,", sub: "Under One Roof" },
  { icon: Timer, title: "Days, Not Weeks,", sub: "To Sanction" },
  { icon: Landmark, title: "75+ Lenders,", sub: "Compared For You" },
];

const TRUST = [
  { icon: Landmark, label: "75+ Banking Partners" },
  { icon: Timer, label: "Speed to Sanction" },
  { icon: TrendingUp, label: "Large-Ticket Specialists" },
  { icon: Sparkles, label: "Custom-built Loans" },
  { icon: BadgeCheck, label: "Zero Advisory Fee" },
  { icon: Globe, label: "PAN India Service" },
];

/** Each persona pairs one "who we help" story with one "why us" differentiator. */
const PERSONAS = [
  {
    icon: Users,
    title: "Salaried & Self-Employed",
    body: "Home, personal and education loans shaped around your income.",
    why: {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      body: "Rate, fees and foreclosure terms — all in writing, upfront.",
    },
  },
  {
    icon: Briefcase,
    title: "Entrepreneurs & SMEs",
    body: "Business, working-capital and collateral-free funding that fits your cycle.",
    why: {
      icon: Zap,
      title: "Quick, Paperless Process",
      body: "Digital documents and daily updates, from login to disbursal.",
    },
  },
  {
    icon: TrendingDown,
    title: "Lower-EMI Seekers",
    body: "Move an existing loan to a better rate — top-up included.",
    why: {
      icon: Target,
      title: "End-to-End Guidance",
      body: "One advisor from picking the product to after the money lands.",
    },
  },
  {
    icon: Landmark,
    title: "Property Owners",
    body: "Turn residential or commercial property into ready capital.",
    why: {
      icon: BadgeCheck,
      title: "Better Deals Than Direct",
      body: "Our volume with lenders gets you pricing you'd rarely get alone.",
    },
  },
];

const STEPS = [
  {
    icon: Phone,
    title: "Free Consultation",
    body: "Tell us what you need. We map your eligibility and goals — free.",
  },
  {
    icon: Building2,
    title: "Lender Matching",
    body: "We compare live offers and shortlist the lenders that fit you best.",
  },
  {
    icon: ShieldCheck,
    title: "Documentation",
    body: "Paperwork collected digitally; legal and technical checks handled.",
  },
  {
    icon: Timer,
    title: "Sanction & Disbursal",
    body: "We chase the file daily until the money lands in your account.",
  },
];

/** Illustrative client experiences — anonymized composites, not verbatim testimonials. */
const CLIENT_STORIES = [
  {
    name: "Priya Deshmukh",
    city: "Mumbai",
    product: "Home Loan Balance Transfer",
    rating: 5,
    quote:
      "Switched our home loan and shaved ₹3,800 off the EMI within three weeks. Wish we'd called sooner.",
  },
  {
    name: "Rohan Mehta",
    city: "Thane",
    product: "Business Loan",
    rating: 4.5,
    quote:
      "Working capital sanctioned in 9 days flat — right when a big order needed raw materials.",
  },
  {
    name: "Anjali Kulkarni",
    city: "Pune",
    product: "Personal Loan",
    rating: 4,
    quote: "Needed funds fast for a family emergency. Disbursed in two days, no drama at all.",
  },
  {
    name: "Sameer Iyer",
    city: "Navi Mumbai",
    product: "Loan Against Property",
    rating: 5,
    quote:
      "Unlocked funds against our property without touching our savings. Clean process, clear terms.",
  },
  {
    name: "Neha Joshi",
    city: "Mumbai",
    product: "Education Loan",
    rating: 4.5,
    quote: "Got my daughter's admission abroad funded end-to-end, tuition and living costs both.",
  },
  {
    name: "Vikram Shah",
    city: "Pune",
    product: "CGTMSE Funding",
    rating: 4,
    quote: "No collateral, no problem. They found the right scheme for my two-year-old business.",
  },
  {
    name: "Arjun Nair",
    city: "Thane",
    product: "New Car Loan",
    rating: 4.5,
    quote: "100% on-road funding on my first car — didn't touch my savings for the down payment.",
  },
  {
    name: "Kavita Rao",
    city: "Navi Mumbai",
    product: "Balance Transfer",
    rating: 5,
    quote: "One phone call, and my home loan rate dropped by over a full percentage point.",
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d={WA_PATH} />
    </svg>
  );
}

/** Persona selector: replaces two separate "who we help" / "why us" grids with one interactive panel. */
function PersonaPanel() {
  const [active, setActive] = useState(0);
  const persona = PERSONAS[active] ?? PERSONAS[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Left: persona picker list */}
      <div className="space-y-2.5">
        {PERSONAS.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.title}
              type="button"
              onClick={() => setActive(i)}
              className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-gold bg-navy shadow-[var(--shadow-lift)]"
                  : "border-border bg-white hover:border-gold/40 dark:bg-card"
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
                  isActive ? "bg-gold text-navy" : "bg-gold-pale/70 text-gold-dark dark:bg-gold/15"
                }`}
              >
                <p.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-sm font-extrabold ${isActive ? "text-white" : "text-navy dark:text-white"}`}
                >
                  {p.title}
                </span>
                <span
                  className={`block truncate text-xs ${isActive ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {p.body}
                </span>
              </span>
              <ArrowRight
                className={`ml-auto h-4 w-4 shrink-0 transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 text-gold"
                    : "-translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-gold-dark"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Right: detail panel for the selected persona */}
      <div
        key={active}
        className="rise-in relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold-pale/40 via-white to-white p-7 sm:p-9"
      >
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold/10 blur-[60px]" />
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-navy text-gold-light shadow-md">
          <persona.icon className="h-6 w-6" />
        </span>
        <h3 className="relative mt-5 font-heading text-2xl font-bold text-navy dark:text-white">{persona.title}</h3>
        <p className="relative mt-2 text-base leading-relaxed text-muted-foreground">
          {persona.body}
        </p>

        <div className="relative mt-6 flex items-start gap-3 rounded-xl border border-gold/15 bg-white/70 p-4 dark:bg-white/5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
            <persona.why.icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-gold-dark uppercase">
              Why clients like this choose us
            </p>
            <p className="mt-1 text-sm font-bold text-navy dark:text-white">{persona.why.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {persona.why.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Half-star-aware rating, drawn as a gold overlay clipped over a pale-star base. */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <Star className="absolute inset-0 h-3.5 w-3.5 text-gold-pale" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <Star className="h-3.5 w-3.5 fill-current text-gold" />
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-xs font-bold text-navy dark:text-white">{rating}</span>
    </div>
  );
}

/** Letter-style testimonial card — name up top like a signature, quote read as a note, not a spec sheet. */
function StoryCard({ story }: { story: (typeof CLIENT_STORIES)[number] }) {
  const initials = story.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="relative flex w-[300px] shrink-0 flex-col gap-4 rounded-2xl bg-white p-7 shadow-[var(--shadow-card)] sm:w-[350px] dark:bg-card">
      <Quote className="absolute top-6 right-6 h-9 w-9 text-gold-pale/70" />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-gold-light">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy dark:text-white">{story.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {story.city} · {story.product}
          </p>
        </div>
      </div>
      <StarRating rating={story.rating} />
      <p className="font-heading text-[15px] leading-relaxed text-foreground italic">
        "{story.quote}"
      </p>
    </div>
  );
}

/** Horizontally scrollable strip of client experiences — idles into a slow auto-drift, but drag or scroll takes over instantly. */
function ClientStoriesMarquee() {
  const doubled = [...CLIENT_STORIES, ...CLIENT_STORIES];
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [autoDrift, setAutoDrift] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf: number;
    const step = () => {
      if (autoDrift && !dragging.current) {
        el.scrollLeft += 0.5;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoDrift]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current);
  };
  const endDrag = () => {
    dragging.current = false;
  };

  return (
    <div>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => setAutoDrift(false)}
        onMouseLeave={() => setAutoDrift(true)}
        className="flex w-full cursor-grab gap-5 overflow-x-auto py-1 select-none active:cursor-grabbing [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {doubled.map((story, i) => (
          <StoryCard key={`${story.name}-${i}`} story={story} />
        ))}
      </div>
    </div>
  );
}

/** Click-through process stepper: one big active panel instead of four static columns. */
function ProcessStepper() {
  const [active, setActive] = useState(0);
  const step = STEPS[active] ?? STEPS[0]!;

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <span
          aria-hidden
          className="absolute top-6 right-6 left-6 h-0.5 -translate-y-1/2 bg-border sm:top-7"
        />
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => setActive(i)}
              className="group relative z-10 flex flex-col items-center gap-2"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-400 sm:h-14 sm:w-14 ${
                  isActive
                    ? "-translate-y-1 border-gold bg-gold text-navy shadow-[var(--shadow-gold)]"
                    : isDone
                      ? "border-gold/60 bg-white text-gold-dark dark:bg-card"
                      : "border-border bg-white text-muted-foreground group-hover:border-gold/40 dark:bg-card"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-[11px] font-bold sm:block ${isActive ? "text-navy dark:text-white" : "text-muted-foreground"}`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className="rise-in mt-8 flex flex-col items-center gap-5 rounded-2xl border border-gold/15 bg-white p-8 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left dark:bg-card"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md">
          <step.icon className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
            Step {active + 1} of {STEPS.length}
          </p>
          <h3 className="mt-1 font-heading text-xl font-bold text-navy dark:text-white">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setActive((v) => (v + 1) % STEPS.length)}
          className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-xs font-bold text-navy transition-colors hover:border-gold/50 sm:mt-0 sm:ml-auto dark:text-white"
        >
          Next step <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-gold/15 bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.24] lg:block [mask-image:radial-gradient(ellipse_80%_85%_at_58%_45%,black_35%,transparent_88%)]"
        >
          <ConsultationBackdrop />
        </div>

        <div className="relative mx-auto grid max-w-[90rem] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16 lg:px-8 lg:py-20">
          <div className="relative">
            {/* Full-size lockup, given its own line and generous clearance below so it
                reads as a deliberate opening statement rather than a cramped corner mark. */}
            <Reveal>
              <img
                src="/brand/gcs-lockup.png"
                alt="Growth Capital Services"
                width={870}
                height={545}
                className="h-20 w-auto sm:h-24"
              />
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-gold-dark uppercase">
                <span className="h-px w-8 bg-gold" />
                Trusted Loan Advisors — Since 2017
              </p>
            </Reveal>

            <h1 className="mt-5 text-[2.5rem] leading-[1.08] font-bold text-navy sm:text-5xl lg:text-[3.5rem] dark:text-white">
              {["Your", "Growth,"].map((w, i) => (
                <span
                  key={w}
                  className="word-rise mr-[0.25em]"
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                >
                  {w}
                </span>
              ))}
              <br />
              {["Our", "Financial", "Expertise."].map((w, i) => (
                <span
                  key={w}
                  className="word-rise gold-text-static mr-[0.25em] last:mr-0"
                  style={{ animationDelay: `${330 + i * 90}ms` }}
                >
                  {w}
                </span>
              ))}
            </h1>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Leading with integrity — your most ethical financial partner. As Authorized Business
                Associates with top Banks and NBFCs, we&apos;re committed to your financial
                well-being.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
                >
                  Explore Loan Products
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-sm font-bold text-navy transition-colors duration-300 hover:text-gold-dark dark:text-white"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/15 text-navy transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-navy dark:text-white dark:group-hover:text-navy">
                    <WhatsAppIcon />
                  </span>
                  Talk to an Advisor
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <ul className="mt-12 flex max-w-xl flex-wrap items-stretch gap-x-6 gap-y-3 border-t border-border pt-8">
                {HERO_POINTS.map((p) => (
                  <li
                    key={p.title}
                    className="flex flex-col justify-center border-l-2 border-gold/40 pl-3 text-sm leading-snug"
                  >
                    <span className="font-bold text-navy dark:text-white">{p.title}</span>
                    <span className="text-muted-foreground">{p.sub}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Consultation form, with a floating trust badge tucked at its top corner */}
          <Reveal delay={200} className="relative mx-auto w-full max-w-[420px] lg:mr-0">
            <div className="absolute -top-4 -right-4 z-10 hidden items-center gap-1.5 rounded-xl border border-gold/25 bg-navy px-3.5 py-2 shadow-[var(--shadow-lift)] sm:flex">
              <Landmark className="h-3.5 w-3.5 text-gold-light" />
              <span className="text-[11px] font-bold text-white">75+ Banks & NBFCs</span>
            </div>
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* ─── TRUST TICKER ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gold/15 bg-white py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] dark:bg-card">
        <ul className="marquee-track flex w-max items-center hover:[animation-play-state:paused]">
          {[...TRUST, ...TRUST, ...TRUST, ...TRUST].map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              aria-hidden={i >= TRUST.length}
              className="flex items-center gap-2.5 px-7 whitespace-nowrap text-ink/80 dark:text-white"
            >
              <item.icon className="h-5 w-5 text-gold" />
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="ml-12 h-1.5 w-1.5 rounded-full bg-gold/50" />
            </li>
          ))}
        </ul>
      </section>

      {/* ─── SERVICES ─────────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Services"
            title="Financing for Every Goal"
            description="Loan products organized by what you're trying to achieve — home, business or personal."
          />
        </Reveal>
        <LoanGoals />
      </Section>

      {/* ─── PERSONA + WHY US (merged, interactive) ───── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Real people. Real plans. The right loan."
            description="Pick your situation — see the loan we'd shape for you, and the reason clients like you choose Growth Capital."
          />
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <PersonaPanel />
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
            Real Clients, Real Outcomes
          </p>
          <div className="mt-6">
            <ClientStoriesMarquee />
          </div>
        </Reveal>
      </Section>

      {/* ─── EMI CALCULATOR ───────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <EmiCalculator />
        </Reveal>
      </Section>

      {/* ─── HOW IT WORKS (click-through stepper) ─────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title="From hello to disbursal in four steps"
            align="center"
          />
        </Reveal>
        <Reveal delay={80} className="mt-12">
          <ProcessStepper />
        </Reveal>
      </Section>

      {/* ─── MISSION & VISION ─────────────────────────── */}
      <Section className="pt-0">
        <MissionVision
          mission="We are driven by a mission to foster lasting relationships with each client, aiming to deliver excellent service for years to come. Unlike many large national mortgage firms, we prioritize the security and privacy of your information, ensuring a trustworthy partnership."
          vision="Dreaming of a future without barriers, our vision is to transform financial experiences for everyone. We strive to play a crucial role in enhancing financial experience with innovation, trust and inspiration. We aim to lead and reshape the financial landscape in India."
        />
      </Section>

      {/* ─── COMMON CONCERNS ──────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Common Concerns"
            title="The worries we take off your plate"
            description="Real questions we hear before someone signs — and how we handle each one."
          />
        </Reveal>
        <ConcernCards />
      </Section>

      {/* ─── CTA BANNER ───────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12">
            <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
                  Ready to move your loan <span className="gold-text">forward?</span>
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Call {CONTACT.phone} · {CONTACT.hours}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="gold-btn group py-3.5 text-base">
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50 dark:text-white dark:bg-card"
                >
                  <span className="text-[#25D366]">
                    <WhatsAppIcon />
                  </span>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ─── BANK PARTNERS ────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Network"
            title="Banks in our network"
            description="We compare offers across major Banks and NBFCs so you can choose with confidence, without the legwork."
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
