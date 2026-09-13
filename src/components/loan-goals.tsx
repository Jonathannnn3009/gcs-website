import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calculator,
  Car,
  GraduationCap,
  Home,
  RefreshCw,
  Star,
  TrendingDown,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/data/products";

type Goal = {
  slug: string;
  icon: LucideIcon;
  goal: string;
  product: string;
  line: string;
  featured?: boolean;
};

type Category = {
  name: string;
  goals: Goal[];
};

// Grouped so the grid reads as three short, scannable rows instead of one
// long wall of identical cards.
const CATEGORIES: Category[] = [
  {
    name: "Home & Property",
    goals: [
      {
        slug: "home-loan",
        icon: Home,
        goal: "Buy or build your home",
        product: "Home Loan",
        line: "Ready flat, under-construction, plot or self-build — we line up the lender most likely to say yes.",
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
        slug: "balance-transfer",
        icon: TrendingDown,
        goal: "Shrink your EMI",
        product: "Balance Transfer",
        line: "Move to a sharper rate, with a top-up if you need one.",
      },
    ],
  },
  {
    name: "Business & Cash Flow",
    goals: [
      {
        slug: "business-loan",
        icon: Briefcase,
        goal: "Grow your business",
        product: "Business Loan",
        line: "Stock, staff or a new branch — no collateral needed.",
      },
      {
        slug: "working-capital",
        icon: RefreshCw,
        goal: "Keep cash flowing",
        product: "Working Capital",
        line: "Cash credit, overdraft and bill discounting sized to your business cycle.",
      },
    ],
  },
  {
    name: "Personal Goals",
    goals: [
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
    ],
  },
];

function GoalCard({ goal: g, index }: { goal: Goal; index: number }) {
  return (
    <Reveal delay={index * 60} className="h-full">
      <Link
        to="/services/$slug"
        params={{ slug: g.slug }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]"
      >
        {/* Gold wash that eases in on hover, echoing the featured-card treatment */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-gold-pale/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {g.featured && (
          <span className="pulse-gold absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gold-pale px-2.5 py-1 text-[10px] font-bold tracking-wide text-gold-dark uppercase">
            <Star className="h-2.5 w-2.5 fill-current" />
            Most popular
          </span>
        )}

        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out]">
          <g.icon className="h-6 w-6" />
        </span>

        <h4 className="relative mt-4 font-heading text-lg leading-tight font-bold text-navy">
          {g.goal}
        </h4>
        <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{g.line}</p>

        <span className="relative mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold text-navy transition-colors group-hover:text-gold-dark">
          {g.product} details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-dark transition-all duration-300 group-hover:w-[calc(100%-1.25rem)]" />
        </span>
      </Link>
    </Reveal>
  );
}

/** "What are you planning?" goal grid used on the Home and Services pages. */
export function LoanGoals() {
  let cardIndex = 0;

  return (
    <div className="mt-10 space-y-10">
      {CATEGORIES.map((category, i) => (
        <div key={category.name}>
          <Reveal delay={i * 80}>
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                {category.name}
              </p>
              <div className="h-px flex-1 origin-left scale-x-0 bg-border transition-transform delay-200 duration-700 ease-out group-data-[shown=true]/reveal:scale-x-100" />
            </div>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.goals.map((g) => (
              <GoalCard key={g.slug} goal={g} index={cardIndex++} />
            ))}
          </div>
        </div>
      ))}

      <Reveal delay={CATEGORIES.length * 80}>
        <div className="group/cta relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-gold/20 bg-gold-pale/30 px-6 py-5 text-center transition-colors duration-500 hover:border-gold/40 sm:flex-row sm:text-left">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold-pale/0 via-gold-pale/40 to-gold-pale/0 opacity-0 transition-opacity duration-700 group-hover/cta:opacity-100" />

          <div className="relative">
            <p className="font-heading text-base font-bold text-navy">Not sure which one fits?</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Check your eligibility in under 2 minutes, or browse all {PRODUCTS.length} loan types
              we arrange.
            </p>
          </div>
          <div className="relative flex shrink-0 items-center gap-3">
            <Link
              to="/tools"
              hash="eligibility"
              className="group/btn inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft hover:shadow-[var(--shadow-card)]"
            >
              <Calculator className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:rotate-[-8deg] group-hover/btn:scale-110" />
              Check eligibility
            </Link>
            <Link
              to="/services"
              className="group/link relative text-xs font-bold text-navy transition-colors hover:text-gold-dark"
            >
              See all loans
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-gold transition-all duration-300 group-hover/link:bg-gold-dark" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
