import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";
import { PRODUCT_GROUPS } from "@/data/products";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Gold accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div className="bg-white">
        {/* Main footer grid */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src="/brand/gcs-logo.png"
              alt="Growth Capital Services — Your growth, our financial expertise"
              width={870}
              height={595}
              className="h-28 w-auto object-contain mix-blend-multiply"
            />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Established in 2017. Tailored loan solutions from leading Banks and NBFCs across
              Mumbai, Thane, Navi Mumbai and Pune. Your dreams, our funding expertise.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-lg bg-[#25D366]/15 text-[#25D366] transition-colors hover:bg-[#25D366]/25"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
                </svg>
              </a>
              <a
                href={CONTACT.phoneHref}
                className="grid h-10 w-10 place-items-center rounded-lg bg-gold/10 text-gold transition-colors hover:bg-gold/20"
                aria-label="Call us"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="grid h-10 w-10 place-items-center rounded-lg bg-gold/10 text-gold transition-colors hover:bg-gold/20"
                aria-label="Email us"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] text-gold-dark uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Our Services" },
                { to: "/tools", label: "EMI Calculator" },
                { to: "/case-studies", label: "Case Studies" },
                { to: "/ca-legal-services", label: "CA & Legal Services" },
                { to: "/partner", label: "Become Partner" },
                { to: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Products */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] text-gold-dark uppercase">
              Loan Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <Link
                    to="/services"
                    hash={s.id}
                    className="text-muted-foreground transition-colors hover:text-gold"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.18em] text-gold-dark uppercase">
              Reach Us
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={CONTACT.phoneHref}
                  className="text-ink/80 transition-colors hover:text-gold"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-ink/80 transition-colors hover:text-gold"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">{CONTACT.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">{CONTACT.hours}</span>
              </li>
            </ul>

            {/* CTA */}
            <Link to="/contact" className="gold-btn mt-6 inline-flex">
              Request a Callback
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/15">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <span>© {new Date().getFullYear()} Growth Capital Services. All rights reserved.</span>
            <span className="flex flex-wrap items-center justify-center gap-1.5">
              Serving
              {CONTACT.cities.map((city, i) => (
                <span key={city}>
                  <Link
                    to={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gold/80 transition-colors hover:text-gold"
                  >
                    {city}
                  </Link>
                  {i < CONTACT.cities.length - 1 && " · "}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
