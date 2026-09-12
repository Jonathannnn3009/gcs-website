import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Menu, Phone, X, ChevronDown, ArrowRight } from "lucide-react";
import { CONTACT } from "@/data/site";
import { BrandLogo } from "@/components/brand-logo";
import { PRODUCTS } from "@/data/products";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services", dropdown: "services" },
  { to: "/tools", label: "Tools", dropdown: "tools" },
  { to: "/bank-partners", label: "Bank Partners" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact Us" },
] as const;

const TOOL_ITEMS = [
  { label: "EMI Calculator", desc: "Estimate your monthly EMI", hash: "emi" },
  { label: "Eligibility Calculator", desc: "Find your max loan amount", hash: "eligibility" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDropdown = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-400 ${
        scrolled
          ? "border-gold/10 bg-white/95 shadow-[0_4px_30px_oklch(0.13_0.04_265/0.08)] backdrop-blur-xl"
          : "border-transparent bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-5 py-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Growth Capital Services — Home"
          className="shrink-0 justify-self-start"
          onClick={() => setMobileOpen(false)}
        >
          <BrandLogo size="md" layout="horizontal" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            {NAV.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={() => openDropdown(link.dropdown!)}
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      to={link.to}
                      activeOptions={{ exact: false }}
                      activeProps={{ className: "text-foreground" }}
                      inactiveProps={{ className: "text-muted-foreground" }}
                      className="group relative flex items-center gap-1 rounded-md px-4 py-2.5 text-[15px] font-semibold transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          activeDropdown === link.dropdown ? "rotate-180 text-gold" : ""
                        }`}
                      />
                    </Link>

                    {/* Services Mega Dropdown */}
                    {link.dropdown === "services" && activeDropdown === "services" && (
                      <div
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                        style={{ animation: "gcs-scale-in 200ms ease both" }}
                      >
                        <div className="w-[720px] overflow-hidden rounded-2xl border border-gold/10 bg-white shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.2)]">
                          <div className="grid grid-cols-[220px_1fr]">
                            {/* Left panel */}
                            <div className="panel-light p-5">
                              <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">Loan Products</p>
                              <p className="mt-2 text-base font-extrabold leading-tight">
                                Loans for every<br />plan you make.
                              </p>
                              <p className="mt-2 text-xs leading-relaxed opacity-70">
                                Matched with the right lender from our network of leading Banks & NBFCs.
                              </p>
                              <Link
                                to="/services"
                                onClick={() => setActiveDropdown(null)}
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold transition-colors hover:text-gold-light"
                              >
                                Browse the full list <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                            {/* Right panel — every product, flat, together */}
                            <div className="grid max-h-[420px] grid-cols-2 gap-1 overflow-y-auto p-4">
                              {PRODUCTS.map((product) => (
                                <Link
                                  key={product.slug}
                                  to="/services"
                                  hash={product.slug}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/item flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-gold/5"
                                >
                                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gold-pale/50 text-gold-dark transition-colors duration-300 group-hover/item:animate-[gcs-wiggle_600ms_ease-in-out] group-hover/item:bg-gold group-hover/item:text-navy">
                                    <product.icon className="h-3.5 w-3.5" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-xs font-semibold text-foreground">{product.title}</span>
                                    <span className="block truncate text-[11px] text-muted-foreground">{product.tagline}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tools Dropdown */}
                    {link.dropdown === "tools" && activeDropdown === "tools" && (
                      <div
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                        style={{ animation: "gcs-scale-in 200ms ease both" }}
                      >
                        <div className="w-[320px] overflow-hidden rounded-xl border border-gold/10 bg-white p-3 shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.2)]">
                          <p className="mb-2 px-2 text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">Calculators</p>
                          {TOOL_ITEMS.map((tool) => (
                            <Link
                              key={tool.hash}
                              to="/tools"
                              hash={tool.hash}
                              onClick={() => setActiveDropdown(null)}
                              className="group/tool flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/5"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-gold transition-colors group-hover/tool:bg-gold/10">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                  <rect x="4" y="4" width="16" height="16" rx="2" />
                                  <path d="M8 9h8M8 13h5M8 17h3" />
                                </svg>
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-foreground">{tool.label}</span>
                                <span className="block text-[11px] text-muted-foreground">{tool.desc}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-foreground after:w-full" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="relative rounded-md px-4 py-2.5 text-[15px] font-semibold transition-colors after:absolute after:bottom-0.5 after:left-4 after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:text-foreground hover:after:w-[calc(100%-2rem)]"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Apply CTA */}
          <Link
            to="/contact"
            className="gold-btn hidden py-2.5 sm:inline-flex"
          >
            Apply Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white lg:hidden" style={{ animation: "gcs-slide-up 300ms ease both" }}>
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-gold" }}
                className="rounded-md px-2 py-3 text-sm font-semibold text-foreground transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="gold-btn mt-3 justify-center py-3"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z"/></svg>
              Chat on WhatsApp
            </a>
            <a
              href={CONTACT.phoneHref}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold"
            >
              <Phone className="h-4 w-4 text-gold" /> {CONTACT.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
