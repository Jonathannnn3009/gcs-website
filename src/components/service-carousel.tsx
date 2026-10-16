import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselItem = {
  /** Category name, used for the card title and to build the page anchor. */
  name: string;
  /** How many loan products are in it. */
  count: number;
  /** Small illustration shown on the card. */
  image: string;
};

const IMAGES: Record<string, string> = {
  "Property Finance": "/illustrations/cards/property.webp",
  "Business Growth": "/illustrations/cards/business.webp",
  "Cash Flow & Trade": "/illustrations/cards/cashflow.webp",
  "Personal, Education, Vehicle & Other Loans": "/illustrations/cards/personal.webp",
};

export const imageForGroup = (name: string) => IMAGES[name] ?? "/illustrations/cards/property.webp";

const anchorFor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * A row of tall picture cards, one per loan category. The card in the middle is the biggest, the
 * ones beside it step back; swipe or use the arrows to move along. Tapping the middle card takes
 * you to that category's loans further down the page; tapping a side card brings it to the middle.
 */
export function ServiceCarousel({ items }: { items: CarouselItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(Math.floor(items.length / 2));

  // Scale each card by how close it is to the middle of the row, and note which one is nearest.
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const centre = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(centre - mid);
      const t = Math.min(1, dist / (c.offsetWidth * 1.4));
      c.style.transform = `scale(${1.06 - t * 0.2})`;
      c.style.opacity = String(1 - t * 0.35);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const c = cards.current[i];
    if (!el || !c) return;
    el.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // start with the middle card in the centre (cards on both sides), then keep the scaling in step with scrolling
    const el = track.current;
    if (!el) return;
    const c = cards.current[Math.floor(items.length / 2)];
    if (c) el.scrollLeft = c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, items.length]);

  const open = (i: number, name: string) => {
    if (i !== active) return goTo(i);
    document.getElementById(anchorFor(name))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative">
      <div
        ref={track}
        onScroll={update}
        className="flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[calc(50%-8.5rem)] py-8 [scrollbar-width:none] sm:gap-6 sm:px-[calc(50%-10rem)] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label="Loan categories"
      >
        {items.map((it, i) => (
          <button
            key={it.name}
            ref={(el) => {
              cards.current[i] = el;
            }}
            type="button"
            onClick={() => open(i, it.name)}
            aria-label={`${it.name}, ${it.count} loans`}
            aria-current={i === active}
            className="group relative h-[22rem] w-[17rem] shrink-0 snap-center overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b from-[#fdf6e3] via-white to-[#f3ead0] text-left shadow-[0_18px_40px_-18px_oklch(0.13_0.04_265/0.45)] transition-[transform,opacity] duration-300 ease-out sm:h-[26rem] sm:w-[20rem] dark:from-card dark:via-card dark:to-card"
            style={{ willChange: "transform" }}
          >
            <img
              src={it.image}
              alt=""
              width={640}
              height={640}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1633] via-[#0a1633]/90 to-transparent px-5 pt-14 pb-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p
                    className="text-xl leading-tight font-bold text-white"
                    style={{ fontFamily: "var(--font-sans)", letterSpacing: "0" }}
                  >
                    {it.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gold-light">{it.count} loans</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-colors group-hover:bg-gold group-hover:text-navy">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous category"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-navy shadow-sm transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-40 dark:bg-card dark:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(Math.min(items.length - 1, active + 1))}
          disabled={active === items.length - 1}
          aria-label="Next category"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-navy shadow-sm transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-40 dark:bg-card dark:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
