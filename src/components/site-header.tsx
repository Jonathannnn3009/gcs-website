import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Menu, Phone, X, ChevronDown, ArrowRight, type LucideIcon } from "lucide-react";
import { CONTACT } from "@/data/site";
import { BrandLogo } from "@/components/brand-logo";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { NAV_CIBIL, NAV_HEADER, NAV_PARTNER, NAV_TOOLS } from "@/data/page-lists";
import { useList, useProductGroups } from "@/lib/page-lists";



export function SiteHeader() {
  // The contact page has its own button, and Case Studies sits under About Us as a tab, so neither is listed again here.
  const NAV = useList("nav.header", NAV_HEADER)
    .filter((l) => l["to"] !== "/contact" && l["to"] !== "/case-studies")
    .map((l) => ({
    to: String(l["to"]),
    label: String(l["label"]),
    dropdown:
      l["to"] === "/services"
        ? ("services" as const)
        : l["to"] === "/tools"
          ? ("tools" as const)
          : l["to"] === "/cibil"
            ? ("cibil" as const)
          : l["to"] === "/partner"
            ? ("partner" as const)
            : undefined,
  }));
  const PARTNER_ITEMS = useList("nav.partner", NAV_PARTNER);
  const CIBIL_ITEMS = useList("nav.cibil", NAV_CIBIL);
  const TOOL_ITEMS = useList("nav.tools", NAV_TOOLS);
  const PRODUCT_GROUPS_LIVE = useProductGroups();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(72);
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
          ? "border-gold/10 bg-white/95 shadow-[0_4px_30px_oklch(0.13_0.04_265/0.08)] backdrop-blur-xl dark:bg-card/95"
          : "border-transparent bg-white/80 backdrop-blur-md dark:bg-card/80"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-5 py-3.5 sm:px-8 lg:px-6 xl:gap-4 min-[1360px]:max-w-[120rem] min-[1536px]:px-10">
        {/* Logo — fixed width, never shrinks even if the nav grows */}
        <Link
          to="/"
          aria-label="Growth Capital Services — Home"
          className="shrink-0 justify-self-start"
          onClick={() => setMobileOpen(false)}
        >
          <BrandLogo size="md" layout="horizontal" />
        </Link>

        {/* Right side */}
        <div className="flex min-w-0 items-center justify-end gap-2 2xl:gap-4">
          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-end gap-0 text-[clamp(15px,calc(1.35vw_-_3.2px),22px)] [--s:clamp(20px,calc(4.28vw_-_36.9px),45.3px)] min-[1360px]:flex">
            {NAV.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={(e) => {
                      setMenuTop(e.currentTarget.getBoundingClientRect().bottom - 8);
                      openDropdown(link.dropdown!);
                    }}
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      to={link.to as "/"}
                      activeOptions={{ exact: false }}
                      activeProps={{ className: "text-foreground" }}
                      inactiveProps={{ className: "text-muted-foreground" }}
                      className="group relative flex items-center gap-0.5 rounded-md px-[calc(var(--s)/2)] py-2 font-semibold whitespace-nowrap transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 min-[1536px]:h-4 min-[1536px]:w-4 ${
                          activeDropdown === link.dropdown ? "rotate-180 text-gold" : ""
                        }`}
                      />
                    </Link>

                    {/* Services Mega Dropdown */}
                    {link.dropdown === "services" && activeDropdown === "services" && (
                      <div
                        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center"
                        style={{ top: menuTop }}
                      >
                       <div className="pointer-events-auto pt-2" style={{ animation: "gcs-scale-in 200ms ease both" }}>
                        <div className="flex max-w-[calc(100vw-2rem)] w-[1200px] overflow-hidden rounded-2xl border border-gold/10 bg-white shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.3)] dark:bg-card">
                          {/* Left: the navy gradient panel */}
                          <div className="navy-panel relative flex w-[250px] shrink-0 flex-col p-7">
                            <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold/15 blur-[60px]" />
                            <p className="relative text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                              Loan Products
                            </p>
                            <p
                              className="relative mt-3 text-[22px] leading-snug font-bold text-white"
                              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0" }}
                            >
                              {PRODUCTS.length} loan products, one team.
                            </p>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-white/70">
                              We help you compare options from 75+ Banks and NBFCs, with support at every step.
                            </p>
                            <Link
                              to="/services"
                              onClick={() => setActiveDropdown(null)}
                              className="gold-btn relative mt-5 self-start px-5 py-2.5 text-[13px]"
                            >
                              Browse all services <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <div className="relative mt-auto border-t border-white/15 pt-4">
                              <p className="text-[11px] text-white/55">Prefer to talk?</p>
                              <a
                                href={CONTACT.phoneHref}
                                className="mt-0.5 block text-[15px] font-bold text-gold-light hover:text-white"
                              >
                                {CONTACT.phone}
                              </a>
                            </div>
                          </div>

                          {/* Right: every product, by category */}
                          <div
                            className="grid min-w-0 flex-1 gap-3 p-5"
                            style={{ gridTemplateColumns: `repeat(${PRODUCT_GROUPS_LIVE.length}, minmax(0, 1fr))` }}
                          >
                            {PRODUCT_GROUPS_LIVE.map((group) => (
                              <div key={group.name} className="min-w-0">
                                <p className="border-b border-gold/20 pb-2 text-[10px] font-bold tracking-[0.14em] text-gold-dark uppercase">
                                  {group.name}
                                </p>
                                <div className="mt-2 space-y-0.5">
                                  {PRODUCTS.filter((p) => p.group === group.name).map((product) => (
                                    <Link
                                      key={product.slug}
                                      to="/services/$slug"
                                      params={{ slug: product.slug }}
                                      onClick={() => setActiveDropdown(null)}
                                      className="group/item flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-gold/5"
                                    >
                                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gold-pale/50 text-gold-dark transition-colors duration-300 group-hover/item:animate-[gcs-wiggle_600ms_ease-in-out] group-hover/item:bg-gold group-hover/item:text-navy dark:bg-gold/12">
                                        <product.icon className="h-3.5 w-3.5" />
                                      </span>
                                      <span className="min-w-0 pt-0.5">
                                        <span className="block text-[13px] leading-snug font-semibold text-foreground">
                                          {product.title}
                                        </span>
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                       </div>
                      </div>
                    )}

                    {/* partner dropdown: the same two-part panel as Services and Calculators */}
                    {link.dropdown === "partner" && activeDropdown === "partner" && (
                      <div
                        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center"
                        style={{ top: menuTop }}
                      >
                       <div className="pointer-events-auto pt-2" style={{ animation: "gcs-scale-in 200ms ease both" }}>
                        <div className="flex max-w-[calc(100vw-2rem)] w-[620px] overflow-hidden rounded-2xl border border-gold/10 bg-white shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.3)] dark:bg-card">
                          {/* Left: the navy gradient panel */}
                          <div className="navy-panel relative flex w-[240px] shrink-0 flex-col p-7">
                            <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold/15 blur-[60px]" />
                            <p className="relative text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                              Partner With Us
                            </p>
                            <p
                              className="relative mt-3 text-[22px] leading-snug font-bold text-white"
                              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0" }}
                            >
                              Grow with a team behind you.
                            </p>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-white/70">
                              Join as an agent, builder or freelancer. We handle the lender follow-ups, so you can focus on your clients.
                            </p>
                            <Link
                              to="/partner"
                              onClick={() => setActiveDropdown(null)}
                              className="gold-btn relative mt-5 self-start px-5 py-2.5 text-[13px]"
                            >
                              Become a partner <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          {/* Right: the pages */}
                          <div className="grid min-w-0 flex-1 grid-cols-1 content-start gap-1 p-4">
                            {PARTNER_ITEMS.map((item) => {
                              const Icon = item["icon"] as LucideIcon;
                              return (
                                <Link
                                  key={String(item["to"])}
                                  to={String(item["to"]) as "/"}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/partner flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/5"
                                >
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-pale/50 text-gold-dark transition-colors duration-300 group-hover/partner:bg-gold group-hover/partner:text-navy dark:bg-gold/12">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-foreground">
                                      {String(item["label"])}
                                    </span>
                                    <span className="block text-[11px] text-muted-foreground">
                                      {String(item["desc"])}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                       </div>
                      </div>
                    )}

                    {/* cibil dropdown: the same two-part panel as Services and Calculators */}
                    {link.dropdown === "cibil" && activeDropdown === "cibil" && (
                      <div
                        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center"
                        style={{ top: menuTop }}
                      >
                       <div className="pointer-events-auto pt-2" style={{ animation: "gcs-scale-in 200ms ease both" }}>
                        <div className="flex max-w-[calc(100vw-2rem)] w-[620px] overflow-hidden rounded-2xl border border-gold/10 bg-white shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.3)] dark:bg-card">
                          {/* Left: the navy gradient panel */}
                          <div className="navy-panel relative flex w-[240px] shrink-0 flex-col p-7">
                            <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold/15 blur-[60px]" />
                            <p className="relative text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                              CIBIL & Credit
                            </p>
                            <p
                              className="relative mt-3 text-[22px] leading-snug font-bold text-white"
                              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0" }}
                            >
                              Know your credit. Plan your next step.
                            </p>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-white/70">
                              Request your report, try the score estimator, or talk to our experts.
                            </p>
                            <Link
                              to="/cibil-advisory"
                              onClick={() => setActiveDropdown(null)}
                              className="gold-btn relative mt-5 self-start px-5 py-2.5 text-[13px]"
                            >
                              CIBIL advisory <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          {/* Right: the pages */}
                          <div className="grid min-w-0 flex-1 grid-cols-1 content-start gap-1 p-4">
                            {CIBIL_ITEMS.map((item) => {
                              const Icon = item["icon"] as LucideIcon;
                              return (
                                <Link
                                  key={String(item["to"])}
                                  to={String(item["to"]) as "/"}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/cibil flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/5"
                                >
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-pale/50 text-gold-dark transition-colors duration-300 group-hover/cibil:bg-gold group-hover/cibil:text-navy dark:bg-gold/12">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-foreground">
                                      {String(item["label"])}
                                    </span>
                                    <span className="block text-[11px] text-muted-foreground">
                                      {String(item["desc"])}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                       </div>
                      </div>
                    )}

                    {/* Tools Dropdown */}
                    {link.dropdown === "tools" && activeDropdown === "tools" && (
                      <div
                        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center"
                        style={{ top: menuTop }}
                      >
                       <div className="pointer-events-auto pt-2" style={{ animation: "gcs-scale-in 200ms ease both" }}>
                        <div className="flex max-w-[calc(100vw-2rem)] w-[820px] overflow-hidden rounded-2xl border border-gold/10 bg-white shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.3)] dark:bg-card">
                          {/* Left: the navy gradient panel */}
                          <div className="navy-panel relative flex w-[240px] shrink-0 flex-col p-7">
                            <div className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold/15 blur-[60px]" />
                            <p className="relative text-[10px] font-bold tracking-[0.22em] text-gold uppercase">
                              Calculators
                            </p>
                            <p
                              className="relative mt-3 text-[22px] leading-snug font-bold text-white"
                              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0" }}
                            >
                              Run the numbers before you apply.
                            </p>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-white/70">
                              Free tools. Nothing you enter is saved or sent.
                            </p>
                            <Link
                              to="/tools"
                              onClick={() => setActiveDropdown(null)}
                              className="gold-btn relative mt-5 self-start px-5 py-2.5 text-[13px]"
                            >
                              All calculators <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>

                          {/* Right: the calculators */}
                          <div className="grid min-w-0 flex-1 grid-cols-2 content-start gap-1 p-4">
                            {TOOL_ITEMS.map((tool) => (
                              <Link
                                key={tool.hash}
                                to="/tools"
                                hash={tool.hash}
                                onClick={() => setActiveDropdown(null)}
                                className="group/tool flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gold/5"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-pale/50 text-gold-dark transition-colors group-hover/tool:bg-gold group-hover/tool:text-navy dark:bg-gold/12">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                  >
                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                    <path d="M8 9h8M8 13h5M8 17h3" />
                                  </svg>
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold text-foreground">
                                    {tool.label}
                                  </span>
                                  <span className="block truncate text-[11px] text-muted-foreground">
                                    {tool.desc}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                       </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to as "/"}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-foreground after:w-full" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="relative rounded-md px-[calc(var(--s)/2)] py-2 font-semibold whitespace-nowrap transition-colors after:absolute after:bottom-0.5 after:left-[calc(var(--s)/2)] after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:text-foreground hover:after:w-[calc(100%-var(--s))]"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher className="hidden sm:inline-flex" />

          {/* Apply CTA */}
          <Link to="/contact" className="gold-btn hidden py-2 whitespace-nowrap sm:inline-flex xl:px-[1.1em] xl:text-[clamp(15px,calc(1.35vw_-_3.2px),22px)] min-[1536px]:py-2.5">
            Contact Us
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border min-[1360px]:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t bg-white min-[1360px]:hidden dark:bg-card"
          style={{ animation: "gcs-slide-up 300ms ease both" }}
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((link) => (
              <div key={link.to} className="flex flex-col">
                <Link
                  to={link.to as "/"}
                  onClick={() => setMobileOpen(false)}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "text-gold" }}
                  className="rounded-md px-2 py-3 text-sm font-semibold text-foreground transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
                {link.dropdown === "partner" &&
                  PARTNER_ITEMS.map((item) => (
                    <Link
                      key={String(item["to"])}
                      to={String(item["to"]) as "/"}
                      onClick={() => setMobileOpen(false)}
                      className="ml-4 rounded-md border-l-2 border-gold/30 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {String(item["label"])}
                    </Link>
                  ))}
                {link.dropdown === "cibil" &&
                  CIBIL_ITEMS.map((item) => (
                    <Link
                      key={String(item["to"])}
                      to={String(item["to"]) as "/"}
                      onClick={() => setMobileOpen(false)}
                      className="ml-4 rounded-md border-l-2 border-gold/30 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {String(item["label"])}
                    </Link>
                  ))}
              </div>
            ))}
            <LanguageSwitcher className="mt-1 self-start" />
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="gold-btn mt-3 justify-center py-3"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
              </svg>
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
