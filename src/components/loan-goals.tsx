import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calculator,
  Car,
  GraduationCap,
  Home,
  RefreshCw,
  TrendingDown,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

type Goal = {
  slug: string;
  icon: LucideIcon;
  goal: string;
  product: string;
  line: string;
  className?: string;
  featured?: boolean;
};

// Order matters: on large screens the grid reads F F a b / F F c d / e f W W.
const GOALS: Goal[] = [
  {
    slug: "home-loan",
    icon: Home,
    goal: "Buy or build your home",
    product: "Home Loan",
    line: "Ready flat, under-construction, plot or self-build — we line up the lender most likely to say yes.",
    className: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    slug: "loan-against-property",
    icon: Building2,
    goal: "Unlock your property's value",
    product: "Loan Against Property",
    line: "Raise serious funds and keep using the property.",
  },
  {
    slug: "business-loan",
    icon: Briefcase,
    goal: "Grow your business",
    product: "Business Loan",
    line: "Stock, staff or a new branch — no collateral needed.",
  },
  {
    slug: "balance-transfer",
    icon: TrendingDown,
    goal: "Shrink your EMI",
    product: "Balance Transfer",
    line: "Move to a sharper rate, with a top-up if you need one.",
  },
  {
    slug: "personal-loan",
    icon: Wallet,
    goal: "Fund a personal plan",
    product: "Personal Loan",
    line: "Wedding, travel, medical or a makeover — sorted in days.",
  },
  {
    slug: "new-car-loan",
    icon: Car,
    goal: "Drive home a new car",
    product: "Car Loan",
    line: "Up to 100% on-road funding, new or pre-owned.",
  },
  {
    slug: "education-loan",
    icon: GraduationCap,
    goal: "Study anywhere",
    product: "Education Loan",
    line: "Tuition, stay and travel — with tax benefits on interest.",
  },
  {
    slug: "working-capital",
    icon: RefreshCw,
    goal: "Keep cash flowing",
    product: "Working Capital",
    line: "Cash credit, overdraft and bill discounting sized to your business cycle.",
    className: "lg:col-span-2",
  },
];

function GoalCard({ goal: g, index }: { goal: Goal; index: number }) {
  return (
    <Reveal delay={index * 70} className={cn("h-full", g.className)}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]",
          g.featured ? "bg-gradient-to-br from-white via-white to-gold-pale/70 p-8" : "p-6",
        )}
      >
        {/* Gold wash that fades in on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-gold-pale/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {g.featured && (
          <img
            src="/brand/hero-city.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 w-full object-cover opacity-25 transition-transform duration-[1200ms] ease-out [mask-image:linear-gradient(to_top,black_30%,transparent)] group-hover:scale-105"
          />
        )}

        <div className="relative flex items-start justify-between">
          <span
            className={cn(
              "grid place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy",
              g.featured ? "h-16 w-16" : "h-12 w-12",
            )}
          >
            <g.icon className={g.featured ? "h-8 w-8" : "h-6 w-6"} />
          </span>
          <ArrowUpRight className="h-5 w-5 -translate-x-2 translate-y-2 text-gold-dark opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>

        <p className="relative mt-5 text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase">
          I want to
        </p>
        <h3
          className={cn(
            "relative mt-1 font-heading leading-tight font-bold text-navy",
            g.featured ? "text-3xl sm:text-4xl" : "text-xl",
          )}
        >
          {g.goal}
        </h3>
        <p
          className={cn(
            "relative mt-2 leading-relaxed text-muted-foreground",
            g.featured ? "max-w-sm text-base" : "text-sm",
          )}
        >
          {g.line}
        </p>

        {/* Actions: always visible on touch screens, slide up on hover for desktop */}
        <div
          className={cn(
            "relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 transition-all duration-500",
            !g.featured &&
              "lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
          )}
        >
          <Link
            to="/tools"
            hash="eligibility"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-soft"
          >
            <Calculator className="h-3.5 w-3.5" />
            Check eligibility
          </Link>
          <Link
            to="/services"
            hash={g.slug}
            className="group/link inline-flex items-center gap-1 text-xs font-bold text-navy transition-colors hover:text-gold-dark"
          >
            {g.product} details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/** "What are you planning?" goal grid used on the Home and Services pages. */
export function LoanGoals() {
  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(200px,auto)] lg:grid-cols-4">
        {GOALS.map((g, i) => (
          <GoalCard key={g.slug} goal={g} index={i} />
        ))}
      </div>
      <Reveal delay={150}>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Planning something else? We arrange {PRODUCTS.length} kinds of loans.{" "}
          <Link
            to="/services"
            className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold-dark"
          >
            See them all
          </Link>
        </p>
      </Reveal>
    </>
  );
}
