// Server only. The things the assistant can *do* rather than just say: exact calculations that
// reuse the same maths as the website's calculators, look-ups in the loan and rate data, and
// opening the callback form. The model never does arithmetic itself; it calls these.

import {
  emi,
  formatCurrency,
  formatINR,
  monthsToYearsMonths,
  principalFromEmi,
  tenureFromEmi,
} from "@/lib/finance";
import { PROFESSIONAL_SERVICES, divisionLabel } from "@/data/professional-services";
import type { CallbackRequest, ResultCard } from "./config";
import type { SiteSnapshot } from "./site-data.server";
import { readSitePage } from "./pages.server";

export type ToolOutput = { result: unknown; card?: ResultCard; form?: CallbackRequest };

class ToolError extends Error {}

type Args = Record<string, unknown>;

function parseArgs(raw: string): Args {
  try {
    const v: unknown = JSON.parse(raw || "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Args) : {};
  } catch {
    return {};
  }
}

/** A required number within a range; anything else is reported back to the model so it can ask again. */
function num(args: Args, key: string, label: string, min: number, max: number): number {
  const raw = args[key];
  const n = typeof raw === "number" ? raw : Number(String(raw ?? "").replace(/[,₹\s]/g, ""));
  if (!Number.isFinite(n) || n < min || n > max) {
    throw new ToolError(`${key} (${label}) must be a number between ${min} and ${max}.`);
  }
  return n;
}

function optNum(
  args: Args,
  key: string,
  label: string,
  min: number,
  max: number,
  fallback: number,
) {
  return args[key] === undefined || args[key] === null || args[key] === ""
    ? fallback
    : num(args, key, label, min, max);
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const pct = (n: number) => `${Number(n.toFixed(2))}%`;
const years = (n: number) => `${Number(n.toFixed(1))} ${n === 1 ? "year" : "years"}`;

const RUPEES = "in rupees as a plain number, e.g. 5000000 for ₹50 lakh";

export const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "calculate_emi",
      description:
        "Exact monthly EMI, total interest and total payable for a loan. Use for any EMI question. Never work out an EMI yourself.",
      parameters: {
        type: "object",
        properties: {
          loan_amount: { type: "number", description: `Loan amount ${RUPEES}.` },
          annual_interest_rate: {
            type: "number",
            description: "Interest rate, percent per year, e.g. 9.5.",
          },
          tenure_years: { type: "number", description: "Loan tenure in years, e.g. 20." },
        },
        required: ["loan_amount", "annual_interest_rate", "tenure_years"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_eligibility",
      description:
        "Indicative maximum loan a person can afford, from take-home income and existing EMIs, using the same method as GCS's Eligibility calculator. If the visitor does not know the rate or tenure, leave them out and the standard assumptions are used.",
      parameters: {
        type: "object",
        properties: {
          monthly_income: {
            type: "number",
            description: `Net monthly income (take-home) ${RUPEES}.`,
          },
          existing_monthly_emi: {
            type: "number",
            description: `Total of all existing loan EMIs and card dues per month ${RUPEES}. 0 if none.`,
          },
          annual_interest_rate: {
            type: "number",
            description: "Optional interest rate, percent per year.",
          },
          tenure_years: { type: "number", description: "Optional tenure in years." },
        },
        required: ["monthly_income"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "estimate_stamp_duty",
      description:
        "Indicative stamp duty and registration charges on buying a property, by state. Uses the GCS stamp duty calculator's rates.",
      parameters: {
        type: "object",
        properties: {
          property_value: { type: "number", description: `Property value ${RUPEES}.` },
          state: {
            type: "string",
            description: "Indian state, e.g. Maharashtra. Defaults to Maharashtra.",
          },
          woman_sole_owner: {
            type: "boolean",
            description:
              "True if the property is registered solely in a woman's name (some states charge less).",
          },
        },
        required: ["property_value"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "balance_transfer_savings",
      description:
        "What moving an existing loan to a lower rate would save: new EMI, interest saved, net saving after the processing fee and the break-even point.",
      parameters: {
        type: "object",
        properties: {
          outstanding_amount: {
            type: "number",
            description: `Principal still to be repaid ${RUPEES}.`,
          },
          remaining_years: { type: "number", description: "Years left on the current loan." },
          current_rate: { type: "number", description: "Current interest rate, percent per year." },
          new_rate: {
            type: "number",
            description: "Rate offered by the new lender, percent per year.",
          },
          processing_fee: {
            type: "number",
            description: `One-time cost of switching ${RUPEES}. Use 0 if the visitor does not know.`,
          },
        },
        required: ["outstanding_amount", "remaining_years", "current_rate", "new_rate"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "prepayment_impact",
      description:
        "Time and interest saved by paying a lump sum towards an existing loan while keeping the EMI unchanged.",
      parameters: {
        type: "object",
        properties: {
          outstanding_amount: {
            type: "number",
            description: `Principal still to be repaid ${RUPEES}.`,
          },
          annual_interest_rate: {
            type: "number",
            description: "Loan interest rate, percent per year.",
          },
          current_emi: { type: "number", description: `Current monthly EMI ${RUPEES}.` },
          prepayment_amount: { type: "number", description: `Lump sum to pay ${RUPEES}.` },
        },
        required: [
          "outstanding_amount",
          "annual_interest_rate",
          "current_emi",
          "prepayment_amount",
        ],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_loan_product_info",
      description:
        "Full details of one GCS loan: key facts, who qualifies, features, and the documents needed (including by applicant type). Use before answering specific questions about a loan's eligibility, documents or features.",
      parameters: {
        type: "object",
        properties: {
          product: {
            type: "string",
            description:
              "The loan's slug or name, e.g. home-loan, 'loan against property', balance-transfer.",
          },
        },
        required: ["product"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_interest_rates",
      description:
        "GCS's indicative starting interest rates, as shown on the Rates page, optionally for one kind of loan. Always present these as starting points, not quotes.",
      parameters: {
        type: "object",
        properties: {
          product: {
            type: "string",
            description: "Optional loan name to filter by, e.g. home loan.",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_website_page",
      description:
        "Read what a page of the GCS website actually says. Use it whenever the visitor asks about something the website covers (a partner programme, commission, steps, FAQs, a loan page, CA and legal services, the about page, a city page, the case studies) and answer from the text returned, keeping figures and claims as written. Paths come from the page index in your instructions.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "A path from the page index, e.g. /partner/builder.",
          },
          part: {
            type: "integer",
            description:
              "For a long page, which part to read (starts at 1). The result says how many parts there are.",
          },
        },
        required: ["path"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_ca_legal_services",
      description:
        "Find GCS's CA and legal services (delivered by associated professionals), e.g. ITR filing, GST registration, property title search, society redevelopment. Call with no query to list the categories.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "What the visitor needs, in a few words." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "show_callback_form",
      description:
        "Show the visitor a short form to request a call from a GCS expert. Use when they want to talk to someone, apply, or need something you cannot do yourself (checking a project's bank approval, an application's status, a custom quote). Do not ask for their name or number in chat.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description:
              "One line for the expert: what the visitor wants, with any key numbers they shared.",
          },
          interested_in: {
            type: "string",
            description: "Loan or service they are interested in, if known.",
          },
        },
        required: ["reason"],
        additionalProperties: false,
      },
    },
  },
] as const;

// ── calculators ─────────────────────────────────────────────────────────────

function toolEmi(a: Args): ToolOutput {
  const amount = num(a, "loan_amount", "rupees", 100_000, 10_000_000_000);
  const rate = num(a, "annual_interest_rate", "percent per year", 1, 36);
  const tenure = num(a, "tenure_years", "years", 1, 40);
  const monthly = emi(amount, rate, tenure);
  const total = monthly * tenure * 12;
  const interest = total - amount;
  return {
    result: {
      monthly_emi: formatINR(monthly),
      total_interest: formatINR(interest),
      total_payable: formatINR(total),
      interest_share_of_total: pct((interest / total) * 100),
      inputs: { loan_amount: formatINR(amount), rate: pct(rate), tenure: years(tenure) },
    },
    card: {
      title: "EMI estimate",
      headline: { label: "Monthly EMI", value: formatINR(monthly) },
      rows: [
        { label: "Loan amount", value: formatCurrency(amount) },
        { label: "Interest rate", value: `${pct(rate)} p.a.` },
        { label: "Tenure", value: years(tenure) },
        { label: "Total interest", value: formatCurrency(interest) },
        { label: "Total payable", value: formatCurrency(total) },
      ],
      note: "Indicative. The lender's final rate and charges decide your actual EMI.",
      link: { label: "Open the EMI calculator", href: "/tools#emi" },
    },
  };
}

function toolEligibility(a: Args, snap: SiteSnapshot): ToolOutput {
  const income = num(a, "monthly_income", "rupees", 1_000, 100_000_000);
  const existing = optNum(a, "existing_monthly_emi", "rupees", 0, 100_000_000, 0);
  const rate = optNum(
    a,
    "annual_interest_rate",
    "percent per year",
    1,
    36,
    snap.eligibilityRatePct,
  );
  const tenure = optNum(a, "tenure_years", "years", 1, 40, 20);
  const foir = snap.foirPct;
  const maxEmi = (income - existing) * (foir / 100);

  if (maxEmi <= 0) {
    return {
      result: {
        max_loan: "₹0",
        reason: "Existing EMIs already use up the share of income lenders allow for repayments.",
        foir_used: `${foir}%`,
      },
      card: {
        title: "Indicative eligibility",
        headline: { label: "Estimated maximum loan", value: "₹0" },
        rows: [
          { label: "Monthly income", value: formatINR(income) },
          { label: "Existing EMIs", value: formatINR(existing) },
        ],
        note: "Existing EMIs already take up the share of income lenders allow for repayments.",
        link: { label: "Open the Eligibility calculator", href: "/tools#eligibility" },
      },
    };
  }

  const maxLoan = principalFromEmi(maxEmi, rate, tenure);
  return {
    result: {
      max_loan: formatCurrency(maxLoan),
      max_loan_exact: formatINR(maxLoan),
      max_emi_affordable: formatINR(maxEmi),
      assumptions: {
        foir: `${foir}% of (income minus existing EMIs)`,
        rate: pct(rate),
        tenure: years(tenure),
      },
      caution:
        "Indicative only. Lenders also weigh credit score, age, job or business stability, the property and its value.",
    },
    card: {
      title: "Indicative eligibility",
      headline: { label: "Estimated maximum loan", value: formatCurrency(maxLoan) },
      rows: [
        { label: "Monthly income", value: formatINR(income) },
        { label: "Existing EMIs", value: formatINR(existing) },
        { label: "EMI you can afford", value: formatINR(maxEmi) },
        { label: "Assumed rate & tenure", value: `${pct(rate)} · ${years(tenure)}` },
      ],
      note: `Based on ${foir}% of income going to EMIs. Actual eligibility depends on the lender.`,
      link: { label: "Open the Eligibility calculator", href: "/tools#eligibility" },
    },
  };
}

function toolStampDuty(a: Args, snap: SiteSnapshot): ToolOutput {
  const value = num(a, "property_value", "rupees", 100_000, 100_000_000_000);
  const wanted = str(a["state"]) || "Maharashtra";
  const states = Object.keys(snap.stampDutyRates);
  const state = states.find((s) => s.toLowerCase() === wanted.toLowerCase());
  if (!state) {
    return {
      result: {
        error: `No stamp duty rate on file for "${wanted}".`,
        states_available: states,
        advice: "Say so, and suggest confirming with the local sub-registrar or a GCS expert.",
      },
    };
  }
  const rates = snap.stampDutyRates[state]!;
  const woman = a["woman_sole_owner"] === true && rates.stampDutyFemale !== undefined;
  const dutyPct = woman ? rates.stampDutyFemale! : rates.stampDuty;
  const duty = (value * dutyPct) / 100;
  const registration = (value * rates.registration) / 100;
  const total = duty + registration;
  return {
    result: {
      state,
      stamp_duty: `${formatINR(duty)} (${pct(dutyPct)})`,
      registration: `${formatINR(registration)} (${pct(rates.registration)})`,
      total: formatINR(total),
      womens_rate_applied: woman,
      womens_rate_available: rates.stampDutyFemale !== undefined,
      caution:
        "Indicative. Local surcharges and exact rates should be confirmed with the sub-registrar.",
    },
    card: {
      title: `Stamp duty · ${state}`,
      headline: { label: "Duty + registration", value: formatCurrency(total) },
      rows: [
        { label: "Property value", value: formatCurrency(value) },
        { label: `Stamp duty (${pct(dutyPct)})`, value: formatINR(duty) },
        { label: `Registration (${pct(rates.registration)})`, value: formatINR(registration) },
      ],
      note: "Indicative. Confirm with the sub-registrar before you rely on it.",
      link: { label: "Open the Stamp Duty calculator", href: "/tools#stamp-duty" },
    },
  };
}

function toolBalanceTransfer(a: Args): ToolOutput {
  const principal = num(a, "outstanding_amount", "rupees", 100_000, 10_000_000_000);
  const remaining = num(a, "remaining_years", "years", 1, 40);
  const currentRate = num(a, "current_rate", "percent per year", 1, 36);
  const newRate = num(a, "new_rate", "percent per year", 1, 36);
  const fee = optNum(a, "processing_fee", "rupees", 0, 100_000_000, 0);

  const months = remaining * 12;
  const oldEmi = emi(principal, currentRate, remaining);
  const newEmi = emi(principal, newRate, remaining);
  const monthly = oldEmi - newEmi;
  const grossSaved = oldEmi * months - principal - (newEmi * months - principal);
  const net = grossSaved - fee;
  const breakeven = monthly > 0 ? fee / monthly : Infinity;
  return {
    result: {
      current_emi: formatINR(oldEmi),
      new_emi: formatINR(newEmi),
      monthly_saving: formatINR(monthly),
      interest_saved_over_remaining_tenure: formatINR(grossSaved),
      processing_fee_assumed: formatINR(fee),
      net_saving_after_fee: formatINR(net),
      break_even: Number.isFinite(breakeven)
        ? monthsToYearsMonths(breakeven)
        : "not applicable (no monthly saving)",
      worthwhile: net > 0,
      caution:
        "Excludes legal, valuation and prepayment charges on the old loan, which can change the answer.",
    },
    card: {
      title: "Balance transfer",
      headline: {
        label: net >= 0 ? "Net saving" : "Net cost",
        value: formatCurrency(Math.abs(net)),
      },
      rows: [
        { label: "EMI now → after transfer", value: `${formatINR(oldEmi)} → ${formatINR(newEmi)}` },
        { label: "Monthly saving", value: formatINR(monthly) },
        { label: "Interest saved", value: formatCurrency(grossSaved) },
        { label: "Switching cost assumed", value: formatINR(fee) },
        {
          label: "Break-even",
          value: Number.isFinite(breakeven) ? monthsToYearsMonths(breakeven) : "—",
        },
      ],
      note: "Excludes legal, valuation and any prepayment charges on the old loan.",
      link: { label: "Open the Balance Transfer calculator", href: "/tools#balance-transfer" },
    },
  };
}

function toolPrepayment(a: Args): ToolOutput {
  const principal = num(a, "outstanding_amount", "rupees", 100_000, 10_000_000_000);
  const rate = num(a, "annual_interest_rate", "percent per year", 1, 36);
  const monthlyEmi = num(a, "current_emi", "rupees", 1_000, 100_000_000);
  const prepay = num(a, "prepayment_amount", "rupees", 1_000, 10_000_000_000);

  const originalMonths = tenureFromEmi(principal, monthlyEmi, rate);
  if (!Number.isFinite(originalMonths)) {
    throw new ToolError(
      "That EMI is too small to ever repay the loan at this rate. Ask the visitor to recheck the numbers.",
    );
  }
  const newPrincipal = Math.max(principal - prepay, 0);
  const newMonths = newPrincipal === 0 ? 0 : tenureFromEmi(newPrincipal, monthlyEmi, rate);
  const monthsSaved = originalMonths - newMonths;
  const oldInterest = monthlyEmi * originalMonths - principal;
  const newInterest = newPrincipal === 0 ? 0 : monthlyEmi * newMonths - newPrincipal;
  const interestSaved = oldInterest - newInterest;
  return {
    result: {
      remaining_tenure_now: monthsToYearsMonths(originalMonths),
      remaining_tenure_after: monthsToYearsMonths(newMonths),
      time_saved: monthsToYearsMonths(monthsSaved),
      interest_saved: formatINR(interestSaved),
      note: "EMI kept unchanged. Check the lender's prepayment charges (usually nil on floating-rate home loans).",
    },
    card: {
      title: "Part-prepayment",
      headline: { label: "Interest saved", value: formatCurrency(interestSaved) },
      rows: [
        { label: "Lump sum paid", value: formatCurrency(prepay) },
        { label: "Time left now", value: monthsToYearsMonths(originalMonths) },
        { label: "Time left after", value: monthsToYearsMonths(newMonths) },
        { label: "Time saved", value: monthsToYearsMonths(monthsSaved) },
      ],
      note: "EMI stays the same. Check the lender's prepayment charges.",
      link: { label: "Open the Prepayment calculator", href: "/tools#prepayment" },
    },
  };
}

// ── look-ups ────────────────────────────────────────────────────────────────

const words = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1);

function toolProduct(a: Args, snap: SiteSnapshot): ToolOutput {
  const q = str(a["product"]).toLowerCase();
  const list = snap.products;
  let p = list.find((x) => x.slug === q) ?? list.find((x) => x.title.toLowerCase() === q);
  if (!p && q) {
    const qw = words(q);
    let best = 0;
    for (const x of list) {
      const hay = new Set(words(`${x.slug} ${x.title}`));
      const score = qw.filter((w) => hay.has(w)).length;
      if (score > best) {
        best = score;
        p = x;
      }
    }
  }
  if (!p) {
    return {
      result: {
        found: false,
        loans_offered: list.map((x) => ({ slug: x.slug, title: x.title })),
        advice:
          "Say you don't see that exact loan, suggest the closest ones, or offer an expert call.",
      },
    };
  }
  const base = {
    found: true,
    title: p.title,
    slug: p.slug,
    page: `/services/${p.slug}`,
    group: p.group,
    tagline: p.tagline,
    key_facts: p.facts.map((f) => `${f.label}: ${f.value}`),
  };
  if (p.minimalDisclosure) {
    return {
      result: {
        ...base,
        ...(p.pullQuote ? { headline: p.pullQuote } : {}),
        note: "An expert shares the full terms of this product directly. Do not add details beyond these facts.",
      },
    };
  }
  return {
    result: {
      ...base,
      about: p.about,
      features: p.features,
      who_qualifies: p.eligibility,
      documents: p.documents,
      ...(p.documentCategories
        ? {
            documents_by_applicant_type: p.documentCategories.map((c) => ({
              applicant: c.label,
              documents: c.items,
            })),
          }
        : {}),
    },
  };
}

function toolRates(a: Args, snap: SiteSnapshot): ToolOutput {
  const q = str(a["product"]).toLowerCase();
  const all = snap.rates.rows;
  const matched = q ? all.filter((r) => r.product.toLowerCase().includes(q)) : all;
  const rows = (matched.length > 0 ? matched : all).slice(0, 30);
  return {
    result: {
      as_of: snap.rates.asOf || "not dated",
      disclaimer: snap.rates.disclaimer,
      default_rate_used_in_calculators: `${snap.rates.defaultEmiRate}%`,
      ...(q && matched.length === 0
        ? { note: `No exact match for "${q}"; showing all loans.` }
        : {}),
      rates: rows.map((r) => ({
        loan: r.product,
        lender: r.bank,
        rate: r.rateTo ? `${r.rateFrom} to ${r.rateTo}` : `from ${r.rateFrom}`,
        ...(r.fee ? { processing_fee: r.fee } : {}),
        ...(r.note ? { note: r.note } : {}),
      })),
      page: "/rates",
    },
  };
}

function toolCaLegal(a: Args): ToolOutput {
  const q = str(a["query"]);
  if (!q) {
    const groups = new Map<string, Set<string>>();
    for (const s of PROFESSIONAL_SERVICES) {
      const key = divisionLabel(s.division);
      if (!groups.has(key)) groups.set(key, new Set());
      groups.get(key)!.add(s.category);
    }
    return {
      result: {
        divisions: [...groups].map(([division, cats]) => ({ division, categories: [...cats] })),
        page: "/ca-legal-services",
        reminder:
          "These are delivered by associated professionals; GCS connects the client and stays the point of contact.",
      },
    };
  }
  const qw = words(q);
  const scored = PROFESSIONAL_SERVICES.map((s) => {
    const title = s.title.toLowerCase();
    const rest = `${s.category} ${s.summary} ${s.whoNeedsIt}`.toLowerCase();
    const score = qw.reduce(
      (n, w) => n + (title.includes(w) ? 3 : 0) + (rest.includes(w) ? 1 : 0),
      0,
    );
    return { s, score };
  })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 5);
  return {
    result: {
      matches: scored.map(({ s }) => ({
        title: s.title,
        division: divisionLabel(s.division),
        category: s.category,
        summary: s.summary.length > 220 ? `${s.summary.slice(0, 217)}...` : s.summary,
        page: `/ca-legal-services/${s.slug}`,
      })),
      ...(scored.length === 0
        ? { note: "Nothing matched. Point them to /ca-legal-services or offer a callback." }
        : {}),
      reminder:
        "Delivered by associated professionals; GCS connects the client and stays the point of contact.",
    },
  };
}

function toolCallback(a: Args): ToolOutput {
  const reason = str(a["reason"]).slice(0, 300) || "Wants to talk to an expert";
  const interest = str(a["interested_in"]).slice(0, 80);
  return {
    result: {
      status: "form_shown",
      instruction:
        "The visitor now sees a short form under your message. Say so in one line and do not ask for their details in chat.",
    },
    form: { reason, ...(interest ? { interest } : {}) },
  };
}

export async function runTool(
  name: string,
  rawArgs: string,
  snap: SiteSnapshot,
  origin: string,
): Promise<ToolOutput> {
  const a = parseArgs(rawArgs);
  try {
    if (name === "read_website_page") {
      const page = await readSitePage(str(a["path"]), Number(a["part"]) || 1, origin);
      return {
        result: page.ok
          ? {
              ...page,
              note: "This is the page's own text. Answer from it, keep its figures as written, and link the page.",
            }
          : { error: page.error, advice: "Answer from your instructions, or offer an expert." },
      };
    }
    switch (name) {
      case "calculate_emi":
        return toolEmi(a);
      case "check_eligibility":
        return toolEligibility(a, snap);
      case "estimate_stamp_duty":
        return toolStampDuty(a, snap);
      case "balance_transfer_savings":
        return toolBalanceTransfer(a);
      case "prepayment_impact":
        return toolPrepayment(a);
      case "get_loan_product_info":
        return toolProduct(a, snap);
      case "get_interest_rates":
        return toolRates(a, snap);
      case "search_ca_legal_services":
        return toolCaLegal(a);
      case "show_callback_form":
        return toolCallback(a);
      default:
        return { result: { error: `Unknown tool ${name}.` } };
    }
  } catch (e) {
    return {
      result: {
        error: e instanceof ToolError ? e.message : "That calculation could not be completed.",
        advice: "Ask the visitor for the missing or unclear figure, in one short question.",
      },
    };
  }
}
