import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** The "Talk to an Expert" button every calculator ends with. Pass layout classes (spacing, when to show it). */
export function CalcExpertButton({ className = "" }: { className?: string }) {
  return (
    <Link to="/contact" className={`gold-btn group w-full justify-center py-3.5 ${className}`}>
      Talk to an Expert
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
