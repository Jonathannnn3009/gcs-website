import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  animate = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Set false to render content immediately, with no scroll-triggered fade-in — for pages where that animation reads as content "not being there yet" rather than a nice reveal. */
  animate?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // Children can react to the reveal via `group-data-[shown=true]/reveal:*`
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group/reveal transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[2px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
