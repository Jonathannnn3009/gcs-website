// Puts what staff set in the CRM (CA & Legal) over the services built into the website: services they hid, services
// they added, and the one-line description under each category in the header menu. Plain functions with no React,
// so the rules are easy to check. Anything the CRM does not set leaves the built-in site exactly as it was.

export type CaLegalCustomService = {
  slug: string;
  division: "CA Services" | "Legal Services";
  category: string;
  title: string;
  summary: string;
  whoNeedsIt?: string;
  process?: string[];
  documents?: string[];
  /** A key of CA_LEGAL_ICONS; anything else shows the document icon. */
  icon?: string;
};

export type CaLegalContent = {
  custom?: CaLegalCustomService[];
  /** Slugs of services (built-in or added) that are not shown on the site. */
  hidden?: string[];
  /** The line under a category's name in the header menu, by category. */
  blurbs?: Record<string, string>;
};

type Svc = { slug: string; division: string; category: string };

/**
 * The visible list: built-in services minus the hidden ones, plus the ones staff added. A new service sits with the
 * others of its category, and a new category goes at the end of its division, so each category stays in one run
 * (the listing page puts its in-page anchor on the first service of a run).
 */
export function mergeServices<T extends Svc>(
  builtIn: T[],
  custom: T[],
  hidden: string[] = [],
): T[] {
  const hide = new Set(hidden);
  const out = builtIn.filter((s) => !hide.has(s.slug));
  for (const c of custom) {
    if (hide.has(c.slug) || out.some((s) => s.slug === c.slug)) continue;
    const lastIndex = (pred: (s: T) => boolean) => out.reduce((at, s, i) => (pred(s) ? i : at), -1);
    const at = lastIndex((s) => s.division === c.division && s.category === c.category);
    const inDivision = at >= 0 ? at : lastIndex((s) => s.division === c.division);
    out.splice(inDivision >= 0 ? inDivision + 1 : out.length, 0, c);
  }
  return out;
}

export type MenuItem<I> = { category: string; icon: I; desc: string };
export type MenuGroup<I> = { anchor: string; heading: string; items: MenuItem<I>[] };

const GROUP_FOR_DIVISION: Record<string, string> = {
  "CA Services": "ca-services",
  "Legal Services": "legal-services",
};

/**
 * The header menu for the services now showing: categories with nothing left in them drop out, a category that only
 * exists because of an added service is added to its team's list, and staff's own line replaces the built-in one.
 */
export function mergeMenu<I>(
  groups: MenuGroup<I>[],
  services: (Svc & { icon: I })[],
  blurbs: Record<string, string> = {},
): MenuGroup<I>[] {
  const has = (cat: string) => services.some((s) => s.category === cat);
  return groups.map((g) => {
    const items: MenuItem<I>[] = g.items
      .filter((it) => has(it.category))
      .map((it) => ({ ...it, desc: blurbs[it.category]?.trim() || it.desc }));
    const known = new Set(g.items.map((it) => it.category));
    for (const s of services) {
      if (GROUP_FOR_DIVISION[s.division] !== g.anchor || known.has(s.category)) continue;
      known.add(s.category);
      items.push({ category: s.category, icon: s.icon, desc: blurbs[s.category]?.trim() ?? "" });
    }
    return { ...g, items };
  });
}
