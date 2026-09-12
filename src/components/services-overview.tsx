import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";

/** Full-directory quick-reference panel — every product, one glance, on the way to the detailed cards below. */
export function ServicesOverview() {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-gold/15 lg:grid-cols-[320px_1fr]">
      {/* Left panel */}
      <div className="navy-panel flex flex-col justify-between p-8 sm:p-10">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Loan Products</p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Twenty-five instruments, one private desk.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Curated lending — placed across India's leading Banks &amp; NBFCs.
          </p>
          <Link to="/contact" className="gold-btn mt-6 py-3">
            Talk to an advisor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-2xl font-extrabold text-gold">45+</p>
          <p className="mt-0.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
            Bank &amp; NBFC Partners
          </p>
        </div>
      </div>

      {/* Right panel — every product, one line each */}
      <div className="grid grid-cols-1 gap-x-2 bg-white p-4 sm:grid-cols-2 sm:p-6">
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            to="/services"
            hash={p.slug}
            className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gold-pale/25"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
              <p.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-foreground">{p.title}</span>
              <span className="block truncate text-[13px] text-muted-foreground">{p.tagline}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
