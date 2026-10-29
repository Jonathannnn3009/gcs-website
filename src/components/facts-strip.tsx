import { useEffect, useRef, useState } from "react";

/** How long the light rests on each fact before gliding to the next. */
const SLOT_MS = 2200;
/** How long the glide itself takes. */
const GLIDE_MS = 1000;

type Box = { x: number; y: number; w: number; h: number };

/**
 * A loan's key facts (interest rate, amount, tenure...) as a clean strip: a hairline above and
 * below, hairline dividers between the facts, small spaced capitals for each label and a large
 * serif gold value. The facts always sit in ONE row (on phones, too narrow for that, they fall
 * into two columns).
 *
 * A thin gold line glides smoothly along the top edge from one fact to the next, in order, and
 * loops; the fact it rests on brightens a little. Nothing is laid over the text, so every value
 * stays crisp and easy to read. It is switched off for visitors who prefer reduced motion.
 */
export function FactsStrip({ facts }: { facts: { label: string; value: string }[] }) {
  const listRef = useRef<HTMLDListElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [single, setSingle] = useState(true); // one row (sm and up) vs two columns (phones)
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    if (facts.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
    const timer = window.setInterval(() => setActive((i) => (i + 1) % facts.length), SLOT_MS);
    return () => window.clearInterval(timer);
  }, [facts.length]);

  // follow the active fact: measure where it sits so the light can glide there
  useEffect(() => {
    if (!animate) return;
    const measure = () => {
      const el = cellRefs.current[active];
      setSingle(window.matchMedia("(min-width: 640px)").matches);
      if (el) setBox({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, animate, facts.length]);

  if (facts.length === 0) return null;
  const n = facts.length;
  // one size for every figure and label, on every loan page, however many there are or however long they run
  const valueSize = "text-[1.05rem] sm:text-[1.15rem]";
  const labelSize = "text-[11px] tracking-[0.16em]";
  const glide = `${GLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;

  return (
    <dl ref={listRef} className="relative mt-8 grid grid-cols-2 border-y border-white/12 sm:flex">
      {/* the gliding line (one row only): a thin gold line along the top edge, nothing over the text */}
      {animate && single && box ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-[-1px] left-0 h-[3px] rounded-full bg-gradient-to-r from-[#e4b028] via-[#ffd66b] to-[#e4b028] shadow-[0_0_10px_rgba(255,206,92,0.75)]"
          style={{
            width: box.w,
            transform: `translateX(${box.x}px)`,
            transition: `transform ${glide}, width ${glide}`,
          }}
        />
      ) : null}

      {facts.map((fact, i) => {
        const on = animate && active === i;
        return (
          <div
            key={fact.label}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className={[
              "relative overflow-hidden py-5 sm:min-w-0 sm:flex-1",
              n <= 3 ? "pr-4 pl-4 sm:pl-6" : "pr-3 pl-4 sm:pl-5",
              i === 0 ? "pl-0 sm:pl-0" : "",
              i % 2 === 1 ? "border-l border-white/12" : "",
              i >= 2 ? "border-t border-white/12" : "",
              i > 0 ? "sm:border-l sm:border-white/12" : "",
              "sm:border-t-0",
              i === n - 1 && n % 2 === 1 ? "max-sm:col-span-2" : "",
            ].join(" ")}
          >
            <dt
              className={`relative flex items-center gap-2 font-bold uppercase transition-colors duration-700 ${labelSize} ${
                on ? "text-white" : "text-white/50"
              }`}
            >
              {fact.label}
            </dt>
            <dd
              className={`relative mt-2 font-heading leading-snug text-gold-light transition-colors duration-700 ${
                on ? "text-[#ffe08a]" : ""
              } ${valueSize}`}
            >
              {fact.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
