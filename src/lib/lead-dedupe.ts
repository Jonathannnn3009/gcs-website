// Duplicate-lead filter. A customer who fills a form twice (or on two different
// forms) must end up as ONE lead. Pure functions only — no storage, no network —
// so the same rules can run in the website today and be moved into the CRM
// intake when the two are connected.
//
// Rules:
//   1. Same phone number (last 10 digits, so +91 / 0 / spacing never matter)
//      AND a matching name  →  the same person, a duplicate.
//   2. Of the duplicates, the one with the most filled-in entries is kept.
//      On a tie the newer one wins (it is usually the corrected one).
//   3. Same phone but clearly different names (a family member, an agent
//      filing for a client) is NOT a duplicate: both are kept and flagged.

export type LeadRecord = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  loanType?: string;
  applicantCategory?: string;
  amount?: number | string;
  detail?: string;
  source?: string;
  /** ISO timestamp or epoch ms; used to break ties and order the output. */
  submittedAt?: string | number;
};

/** The fields that count towards "how many entries did they fill in". */
const ENTRY_FIELDS = [
  "name",
  "phone",
  "email",
  "city",
  "loanType",
  "applicantCategory",
  "amount",
  "detail",
] as const satisfies readonly (keyof LeadRecord)[];

/** A 10-digit Indian mobile number from any common way of writing it, or null. */
export function normalizePhone(raw: string): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  const national =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
  return /^[6-9]\d{9}$/.test(national) ? national : null;
}

const HONORIFICS = new Set(["mr", "mrs", "ms", "miss", "shri", "shree", "smt", "dr", "sri"]);

/** Lower-case words with punctuation, extra spaces and titles removed. */
export function nameTokens(raw: string): string[] {
  return (raw ?? "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !HONORIFICS.has(t));
}

/**
 * Same person? Word order and case do not matter, and a shorter form of the
 * name matches a fuller one ("Rahul Sharma" ~ "Rahul Kumar Sharma" ~ "Rahul").
 * Names with no overlap ("Rahul Sharma" vs "Priya Sharma") do not match.
 */
export function namesMatch(a: string, b: string): boolean {
  const x = nameTokens(a);
  const y = nameTokens(b);
  if (!x.length || !y.length) return false;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  const pool = new Set(long);
  return short.every((t) => pool.has(t));
}

const filled = (v: unknown) =>
  typeof v === "number" ? Number.isFinite(v) : String(v ?? "").trim() !== "";

/** How many of the form's entries this lead actually has. */
export function entryCount(lead: LeadRecord): number {
  return ENTRY_FIELDS.reduce((n, key) => n + (filled(lead[key]) ? 1 : 0), 0);
}

const time = (l: LeadRecord) =>
  l.submittedAt === undefined ? 0 : new Date(l.submittedAt).getTime() || 0;

/** The record to keep out of a set of duplicates: most entries, then newest. */
export function pickBest<T extends LeadRecord>(group: T[]): T {
  return group.reduce((best, cur) => {
    const d = entryCount(cur) - entryCount(best);
    return d > 0 || (d === 0 && time(cur) > time(best)) ? cur : best;
  });
}

export type DedupeResult<T extends LeadRecord> = {
  /** One lead per person, oldest first. This is what goes to the CRM. */
  leads: T[];
  /** What was merged away, for the audit trail. */
  merged: { kept: T; dropped: T[] }[];
  /** Same phone, different names: kept apart, worth a human look. */
  sharedPhones: { phone: string; leads: T[] }[];
  /** Leads whose phone is not a valid number: never merged, passed through. */
  invalidPhone: T[];
};

export function dedupeLeads<T extends LeadRecord>(input: readonly T[]): DedupeResult<T> {
  const ordered = [...input].sort((a, b) => time(a) - time(b));
  const byPhone = new Map<string, T[][]>(); // phone -> clusters of one person each
  const invalidPhone: T[] = [];

  for (const lead of ordered) {
    const phone = normalizePhone(lead.phone);
    if (!phone) {
      invalidPhone.push(lead);
      continue;
    }
    const clusters = byPhone.get(phone) ?? [];
    // Join a cluster only if the name fits everyone already in it, so
    // "Rahul" cannot glue "Rahul Sharma" and "Rahul Verma" into one person.
    const home = clusters.find((c) => c.every((m) => namesMatch(m.name, lead.name)));
    if (home) home.push(lead);
    else clusters.push([lead]);
    byPhone.set(phone, clusters);
  }

  const kept: T[] = [];
  const merged: DedupeResult<T>["merged"] = [];
  const sharedPhones: DedupeResult<T>["sharedPhones"] = [];

  for (const [phone, clusters] of byPhone) {
    const winners = clusters.map((cluster) => {
      const best = pickBest(cluster);
      if (cluster.length > 1)
        merged.push({ kept: best, dropped: cluster.filter((l) => l !== best) });
      return best;
    });
    kept.push(...winners);
    if (winners.length > 1) sharedPhones.push({ phone, leads: winners });
  }

  return {
    leads: [...kept, ...invalidPhone].sort((a, b) => time(a) - time(b)),
    merged,
    sharedPhones,
    invalidPhone,
  };
}

/**
 * Live check for one incoming lead against what is already stored — what the
 * CRM intake will call. Returns the existing lead it duplicates, if any.
 */
export function findDuplicate<T extends LeadRecord>(
  existing: readonly T[],
  incoming: LeadRecord,
): T | undefined {
  const phone = normalizePhone(incoming.phone);
  if (!phone) return undefined;
  return existing.find(
    (e) => normalizePhone(e.phone) === phone && namesMatch(e.name, incoming.name),
  );
}

/** True when the incoming lead is fuller than the stored duplicate and should replace it. */
export function shouldReplace(stored: LeadRecord, incoming: LeadRecord): boolean {
  return pickBest([stored, incoming]) === incoming;
}
