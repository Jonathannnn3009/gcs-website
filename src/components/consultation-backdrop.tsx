import { useEffect, useRef, useState } from "react";
import { CONSULTATION_SCENES } from "@/components/consultation-scenes";

/**
 * Auto-toggling illustration backdrop for the hero/consultation block.
 * Crossfades between CONSULTATION_SCENES on a timer; holds on the first
 * scene (no rotation) if the visitor prefers reduced motion.
 */
export function ConsultationBackdrop({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CONSULTATION_SCENES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {CONSULTATION_SCENES.map((Scene, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Scene />
        </div>
      ))}
    </div>
  );
}
