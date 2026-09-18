import { useState } from "react";
import {
  ArrowLeftRight,
  Calculator,
  CheckCircle2,
  Compass,
  Gauge,
  ReceiptText,
  Timer,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PAIN_POINTS } from "@/data/site";
import { cn } from "@/lib/utils";

// One icon per concern, in PAIN_POINTS order
const ICONS = [Compass, ArrowLeftRight, Calculator, Gauge, ReceiptText, Timer];

/** Flip cards: the question on the front, how we handle it on the back (hover on desktop, tap on touch). */
export function ConcernCards() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PAIN_POINTS.map((p, i) => {
        const Icon = ICONS[i % ICONS.length]!;
        const isOpen = flipped === i;
        return (
          <Reveal key={p.question} delay={i * 70}>
            <button
              type="button"
              onClick={() => setFlipped(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group block h-60 w-full text-left perspective-distant"
            >
              <span
                className={cn(
                  "relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform-3d lg:group-hover:rotate-y-180",
                  isOpen && "max-lg:rotate-y-180",
                )}
              >
                {/* Front */}
                <span className="absolute inset-0 flex flex-col rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)] backface-hidden dark:bg-card">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 dark:bg-gold/15">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-5 font-heading text-xl leading-snug font-bold text-navy dark:text-white">
                    {p.question}
                  </span>
                </span>

                {/* Back */}
                <span className="absolute inset-0 flex rotate-y-180 flex-col justify-center rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-pale via-white to-gold-pale/60 p-6 backface-hidden">
                  <CheckCircle2 className="h-7 w-7 text-gold-dark" />
                  <span className="mt-3 text-[15px] leading-relaxed text-ink dark:text-white">{p.answer}</span>
                </span>
              </span>
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
