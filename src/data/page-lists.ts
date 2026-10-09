// Repeated blocks on the public pages (home, about, why us, partner, services). Staff can add,
// remove, reorder and reword each one in the CRM (Settings -> Website content -> Page sections);
// until they do, the pages show these built-in items. Icons are chosen by name from lib/icon-map.ts.

import {
  Award,
  BadgeCheck,
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Gem,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Key,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  PhoneCall,
  PiggyBank,
  Receipt,
  RefreshCw,
  Rocket,
  Scale,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Timer,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Users2,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { BANK_PARTNERS, CONTACT, PAIN_POINTS, SERVICES } from "@/data/site";
import { BUREAUS, LAST_PULLED_OPTIONS } from "@/data/cibil";
import { LOCATIONS } from "@/data/locations";
import { PRODUCT_GROUPS } from "@/data/products";
import { STAMP_DUTY_RATES } from "@/lib/finance";

export const HOME_HERO_POINTS = [
  { icon: BadgeCheck, title: "Every Loan Type,", sub: "Under One Roof" },
  { icon: Timer, title: "Days, Not Weeks,", sub: "To Sanction" },
  { icon: Landmark, title: "75+ Lenders,", sub: "Compared For You" },
];

export const HOME_TRUST = [
  { icon: Landmark, label: "75+ Banking Partners" },
  { icon: Timer, label: "Speed to Sanction" },
  { icon: TrendingUp, label: "Large-Ticket Specialists" },
  { icon: Sparkles, label: "Custom-built Loans" },
  { icon: BadgeCheck, label: "Zero Advisory Fee" },
  { icon: Globe, label: "PAN India Service" },
  { icon: LayoutDashboard, label: "In-House CRM Tracking" },
];

export const HOME_PERSONAS = [
  {
    icon: Users,
    title: "Salaried & Self-Employed",
    body: "Home, personal and education loans shaped around your income.",
    whyIcon: ShieldCheck,
    whyTitle: "Trust & Transparency",
    whyBody: "Rate, fees and foreclosure terms — all in writing, upfront.",
  },
  {
    icon: Briefcase,
    title: "Entrepreneurs & SMEs",
    body: "Business, working-capital and collateral-free funding that fits your cycle.",
    whyIcon: Zap,
    whyTitle: "Quick, Paperless Process",
    whyBody: "Digital documents and daily updates, from login to disbursal.",
  },
  {
    icon: TrendingDown,
    title: "Lower-EMI Seekers",
    body: "Move an existing loan to a better rate — top-up included.",
    whyIcon: Target,
    whyTitle: "End-to-End Guidance",
    whyBody: "One advisor from picking the product to after the money lands.",
  },
  {
    icon: Landmark,
    title: "Property Owners",
    body: "Turn residential or commercial property into ready capital.",
    whyIcon: BadgeCheck,
    whyTitle: "Better Deals Than Direct",
    whyBody: "Our volume with lenders gets you pricing you'd rarely get alone.",
  },
];

export const HOME_STEPS = [
  {
    icon: Phone,
    title: "Free Consultation",
    body: "Tell us what you need. We map your eligibility and goals — free.",
  },
  {
    icon: Building2,
    title: "Lender Matching",
    body: "We compare live offers and shortlist the lenders that fit you best.",
  },
  {
    icon: ShieldCheck,
    title: "Documentation",
    body: "Paperwork collected digitally; legal and technical checks handled.",
  },
  {
    icon: Timer,
    title: "Sanction & Disbursal",
    body: "We chase the file daily until the money lands in your account.",
  },
];

export const ABOUT_STATS = [
  { value: "2017", label: "Established" },
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "25+", label: "Loan Products" },
  { value: "100%", label: "Transparent Process" },
];

export const ABOUT_WHY = [
  {
    title: "Real Choice, Not One Bank",
    body: "75+ banks and NBFCs in our network, so your file gets more than one shot at approval.",
  },
  {
    title: "Senior Advisors, Not a Call Centre",
    body: "The same experienced advisor stays with your file from the first call to disbursal.",
  },
  {
    title: "Built For Speed",
    body: "Documentation and structuring done right the first time, so approvals don't stall.",
  },
  {
    title: "Nothing Hidden",
    body: "Rate, fees and terms — all in writing, before you sign anything.",
  },
  {
    title: "Structured Around You",
    body: "Your loan packaged around your actual profile, not squeezed into a lender's template.",
  },
];

export const ABOUT_PROCESS = [
  { title: "Consultation", body: "Understanding your financial needs." },
  { title: "Product Matching", body: "Identifying the right fit across our partners." },
  { title: "Documentation Support", body: "Simplifying the paperwork." },
  { title: "Loan Processing", body: "Liaising with lenders for fast approvals." },
  { title: "Post-Disbursal Support", body: "Continued assistance even after disbursal." },
];

export const WHYUS_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    body: "Every quote lists rate, processing fee, legal and technical charges and foreclosure terms in writing.",
  },
  {
    icon: Timer,
    title: "Quick, Paperless Process",
    body: "Digital documentation and daily file tracking through login, sanction and disbursal.",
  },
  {
    icon: Compass,
    title: "End-to-End Guidance",
    body: "Our own case-management CRM tracks every file from lead to disbursal, so nothing falls through the cracks.",
  },
  {
    icon: Sparkles,
    title: "Better Deals Than Direct",
    body: "Our volume across banks and NBFCs earns pricing and fee waivers an individual rarely gets alone.",
  },
];

export const WHYUS_ADVANTAGES = [
  { text: "We compare live policies across 75+ lenders" },
  { text: "Zero advisory fee — we're paid by the lender" },
  { text: "Daily file tracking from login to disbursal" },
  { text: "Complex profiles handled that banks return" },
  { text: "Written savings comparison before you commit" },
  { text: "Single point of contact for the full lifecycle" },
  { text: "In-house CRM tracks your file end-to-end, from lead to disbursal" },
];

export const PARTNER_STATS = [
  { value: "2017", label: "Growth Capital Since" },
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "₹0", label: "Investment Required" },
  { value: "No Cap", label: "On Referral Earnings" },
];

export const PARTNER_HIGHLIGHTS = [
  { text: "No paperwork or compliance work on your end" },
  { text: "Track every referral's status in real time" },
  { text: "Payout settled as soon as the loan disburses" },
];

export const PARTNER_SEGMENTS = [
  {
    icon: Scale,
    title: "Chartered Accountants",
    body: "Your clients ask you about loans already — send us the ones that need one.",
  },
  {
    icon: Building2,
    title: "Property Consultants",
    body: "Every property deal has a financing question somewhere in it.",
  },
  {
    icon: Landmark,
    title: "Real Estate Brokers",
    body: "Help your buyer close faster with financing lined up in parallel.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Advisors",
    body: "A natural extension of the financial conversations you're already having.",
  },
  {
    icon: Briefcase,
    title: "Business Consultants",
    body: "Working capital and business loan needs come up constantly in your work.",
  },
  {
    icon: UserCheck,
    title: "Lawyers & Company Secretaries",
    body: "Refer clients navigating property, business or personal finance decisions.",
  },
];

export const PARTNER_STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: "Tell Us About the Client",
    body: "Share their name, contact and loan requirement — a two-minute form.",
  },
  {
    icon: PhoneCall,
    title: "We Take It From There",
    body: "A senior advisor reaches out, assesses eligibility and manages the file.",
  },
  {
    icon: Calendar,
    title: "You Stay Updated",
    body: "We keep you posted as the file moves through sanction and disbursal.",
  },
  {
    icon: Wallet,
    title: "You Get Paid",
    body: "Your referral fee is settled once the loan is disbursed.",
  },
];

export const PARTNER_BENEFITS = [
  {
    icon: Wallet,
    title: "Zero Investment",
    body: "No franchise fee, no office, no upfront cost — just refer and earn.",
  },
  {
    icon: Zap,
    title: "Uncapped Earnings",
    body: "No ceiling on how much you can earn — more referrals, more income.",
  },
  {
    icon: Check,
    title: "Fast, Transparent Payouts",
    body: "Your referral fee is settled as soon as the loan disburses — no chasing.",
  },
  {
    icon: UserCheck,
    title: "A Dedicated Relationship Manager",
    body: "One point of contact who keeps you updated at every stage.",
  },
  {
    icon: Landmark,
    title: "75+ Bank & NBFC Network",
    body: "Your client gets more shots at approval than going to a single bank.",
  },
  {
    icon: Award,
    title: "You Stay the Trusted Expert",
    body: "We work behind the scenes — your client relationship stays yours.",
  },
];

export const PARTNER_REASONS = [
  {
    q: "No License or Certification Needed",
    a: "Unlike a registered loan agent, you don't need any certification to refer clients to us — just an introduction and a phone number. Our licensed advisors handle the lending process end to end.",
  },
  {
    q: "No Exclusivity Required",
    a: "Refer as much or as little as suits you — there's no minimum commitment, no lock-in and no target to hit.",
  },
  {
    q: "Full Visibility, Start to Finish",
    a: "You'll know exactly where your referral's file stands — from the first call through to sanction and disbursal.",
  },
  {
    q: "Grow Your Professional Network",
    a: "Every successful referral builds a track record with senior advisors across our network of 75+ banks and NBFCs.",
  },
];

export const SERVICES_STATS = [
  { value: `${PRODUCTS.length}+`, label: "Loan Products" },
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "100%", label: "Transparent Process" },
  { value: "2017", label: "Arranging Loans Since" },
];

// ---- menu, footer, forms, banks ------------------------------------------------------------

export const NAV_HEADER = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "Tools", to: "/tools" },
  { label: "CIBIL", to: "/cibil" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "CA & Legal", to: "/ca-legal-services" },
  { label: "Become Partner", to: "/partner" },
  { label: "Contact Us", to: "/contact" },
];

export const NAV_TOOLS = [
  { label: "EMI Calculator", desc: "Estimate your monthly EMI", hash: "emi" },
  { label: "Eligibility Calculator", desc: "Find your max loan amount", hash: "eligibility" },
  { label: "Stamp Duty Calculator", desc: "State-wise registration costs", hash: "stamp-duty" },
  { label: "Prepayment Calculator", desc: "Tenure & interest you'll save", hash: "prepayment" },
  {
    label: "Balance Transfer Calculator",
    desc: "Is switching lenders worth it",
    hash: "balance-transfer",
  },
  { label: "Loan Comparison", desc: "Compare offers side by side", hash: "loan-comparison" },
  {
    label: "Working Capital Estimator",
    desc: "MSME limit, GCS exclusive",
    hash: "working-capital",
  },
  { label: "CGTMSE Guarantee Fee", desc: "Fee on a collateral-free loan", hash: "cgtmse" },
  { label: "Loan Against Property LTV", desc: "What your property can unlock", hash: "lap-ltv" },
  {
    label: "Credit Score Estimator",
    desc: "Indicative range, not a bureau pull",
    hash: "credit-score",
  },
];

export const FOOTER_EXPLORE = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "EMI Calculator", to: "/tools" },
  { label: "Interest Rates", to: "/rates" },
  { label: "Insights", to: "/insights" },
  { label: "CIBIL Report", to: "/cibil" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "CA & Legal Services", to: "/ca-legal-services" },
  { label: "Become Partner", to: "/partner" },
  { label: "Contact Us", to: "/contact" },
];

export const FOOTER_PRODUCTS = SERVICES.slice(0, 8).map((s) => ({
  label: s.title,
  to: `/services#${s.id}`,
}));

export const FORM_LOAN_TYPES = SERVICES.map((s) => ({ title: s.title, slug: s.id }));

export const FORM_CITIES = CONTACT.cities.map((city) => ({ city }));

export const BANKS = BANK_PARTNERS.map((b) => ({
  name: b.name,
  logo: b.logo ?? "",
  small: b.small ? "yes" : "",
}));

// ---- other pages ---------------------------------------------------------------------------

export const HOME_GOALS = [
  {
    category: "Home & Property",
    slug: "home-loan",
    icon: Home,
    goal: "Buy or build your home",
    product: "Home Loan",
    line: "Ready flat, under-construction, plot or self-build — we line up the lender most likely to say yes.",
    featured: "yes",
  },
  {
    category: "Home & Property",
    slug: "loan-against-property",
    icon: Building2,
    goal: "Unlock your property's value",
    product: "Loan Against Property",
    line: "Raise serious funds and keep using the property.",
    featured: "",
  },
  {
    category: "Home & Property",
    slug: "balance-transfer",
    icon: TrendingDown,
    goal: "Shrink your EMI",
    product: "Balance Transfer",
    line: "Move to a sharper rate, with a top-up if you need one.",
    featured: "",
  },
  {
    category: "Business & Cash Flow",
    slug: "business-loan",
    icon: Briefcase,
    goal: "Grow your business",
    product: "Business Loan",
    line: "Stock, staff or a new branch — no collateral needed.",
    featured: "",
  },
  {
    category: "Business & Cash Flow",
    slug: "working-capital",
    icon: RefreshCw,
    goal: "Keep cash flowing",
    product: "Working Capital",
    line: "Cash credit, overdraft and bill discounting sized to your business cycle.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "personal-loan",
    icon: Wallet,
    goal: "Fund a personal plan",
    product: "Personal Loan",
    line: "Wedding, travel, medical or a makeover — sorted in days.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "new-car-loan",
    icon: Car,
    goal: "Drive home a new car",
    product: "Car Loan",
    line: "Up to 100% on-road funding, new or pre-owned.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "education-loan",
    icon: GraduationCap,
    goal: "Study anywhere",
    product: "Education Loan",
    line: "Tuition, stay and travel — with tax benefits on interest.",
    featured: "",
  },
];

export const TOOLS_CARDS = [
  { id: "emi", label: "EMI Calculator", sub: "Estimate your monthly EMI" },
  { id: "eligibility", label: "Eligibility Calculator", sub: "Find your maximum loan amount" },
  { id: "stamp-duty", label: "Stamp Duty Calculator", sub: "State-wise registration costs" },
  { id: "prepayment", label: "Prepayment Calculator", sub: "Tenure & interest you'll save" },
  {
    id: "balance-transfer",
    label: "Balance Transfer Calculator",
    sub: "Is switching lenders worth it",
  },
  { id: "loan-comparison", label: "Loan Comparison", sub: "Compare offers side by side" },
  {
    id: "working-capital",
    label: "Working Capital Estimator",
    sub: "MSME limit — exclusive to GCS",
  },
  { id: "cgtmse", label: "CGTMSE Guarantee Fee", sub: "Fee on a collateral-free business loan" },
  { id: "lap-ltv", label: "Loan Against Property LTV", sub: "What your property can unlock" },
  {
    id: "credit-score",
    label: "Credit Score Estimator",
    sub: "Indicative range, not a bureau pull",
  },
];

export const SERVICES_GROUPS = PRODUCT_GROUPS.map((g) => ({
  name: g.name,
  heading: g.heading,
  description: g.description,
}));

export const CIBIL_BUREAUS = BUREAUS.map((b) => ({ id: b.id, name: b.name, blurb: b.blurb }));

export const CIBIL_LAST_PULLED = LAST_PULLED_OPTIONS.map((o) => ({
  id: o.id,
  label: o.label,
  hint: o.hint,
}));

export const CITY_PAGES = LOCATIONS.map((l) => ({
  slug: l.slug,
  city: l.city,
  intro: l.intro,
  serviceNote: l.serviceNote,
  hasOffice: l.hasOffice ? "yes" : "no",
}));

export const CALC_STAMP_DUTY = Object.entries(STAMP_DUTY_RATES).map(([state, r]) => ({
  state,
  stampDuty: String(r.stampDuty),
  stampDutyFemale: r.stampDutyFemale === undefined ? "" : String(r.stampDutyFemale),
  registration: String(r.registration),
}));

export const CALC_ASSUMPTIONS = [
  { key: "foir", label: "Eligibility: share of income that can go to EMIs (FOIR), %", value: "50" },
  { key: "eligRate", label: "Eligibility: starting interest rate, %", value: "9" },
  { key: "wcGap", label: "Working capital: gap as % of turnover", value: "25" },
  { key: "wcMargin", label: "Working capital: margin money as % of turnover", value: "5" },
  { key: "wcBank", label: "Working capital: bank finance as % of turnover", value: "20" },
  { key: "ltv", label: "Loan against property: starting LTV, %", value: "60" },
  { key: "cgCover", label: "CGTMSE: starting guarantee cover, %", value: "75" },
  { key: "cgFee", label: "CGTMSE: starting fee rate, %", value: "1" },
];

export type FieldSpec = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "icon" | "image" | "readonly";
};
export type ListItem = Record<string, string | LucideIcon>;
export type ListSpec = {
  key: string;
  page: string;
  label: string;
  hint: string;
  fields: FieldSpec[];
  /** Items cannot be added or removed (the page is built around a fixed set), only reworded and reordered. */
  fixed?: boolean;
  items: ListItem[];
};

const T = (key: string, label: string): FieldSpec => ({ key, label, kind: "text" });
const A = (key: string, label: string): FieldSpec => ({ key, label, kind: "textarea" });
const I = (key: string, label: string): FieldSpec => ({ key, label, kind: "icon" });
const G = (key: string, label: string): FieldSpec => ({ key, label, kind: "image" });
const R = (key: string, label: string): FieldSpec => ({ key, label, kind: "readonly" });

/**
 * Every repeated block on a page that staff can add to, remove from, reorder and reword in the
 * CRM. `items` is what the website ships with; the CRM's list replaces it once staff save one.
 */
export const LIST_SPECS: ListSpec[] = [
  {
    key: "home.hero",
    page: "Home",
    label: "Hero highlights",
    hint: "The three short points under the main headline.",
    fields: [I("icon", "Icon"), T("title", "First line"), T("sub", "Second line")],
    items: HOME_HERO_POINTS,
  },
  {
    key: "home.trust",
    page: "Home",
    label: "Trust ticker",
    hint: "The scrolling strip of strengths.",
    fields: [I("icon", "Icon"), T("label", "Text")],
    items: HOME_TRUST,
  },
  {
    key: "home.personas",
    page: "Home",
    label: "Who we help",
    hint: "Each tab: who we help, and the matching reason to choose us.",
    fields: [
      I("icon", "Icon"),
      T("title", "Who"),
      A("body", "How we help"),
      I("whyIcon", "Reason icon"),
      T("whyTitle", "Reason heading"),
      A("whyBody", "Reason text"),
    ],
    items: HOME_PERSONAS,
  },
  {
    key: "home.steps",
    page: "Home",
    label: "How it works",
    hint: "The steps from first call to disbursal.",
    fields: [I("icon", "Icon"), T("title", "Step"), A("body", "Description")],
    items: HOME_STEPS,
  },
  {
    key: "about.stats",
    page: "About",
    label: "Headline figures",
    hint: "The four figures at the top of the page.",
    fields: [T("value", "Figure"), T("label", "Label")],
    items: ABOUT_STATS,
  },
  {
    key: "about.why",
    page: "About",
    label: "Why choose us",
    hint: "Numbered reasons; the numbers follow the order.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: ABOUT_WHY,
  },
  {
    key: "about.process",
    page: "About",
    label: "Our process",
    hint: "Numbered steps; the numbers follow the order.",
    fields: [T("title", "Step"), T("body", "Description")],
    items: ABOUT_PROCESS,
  },
  {
    key: "whyus.pillars",
    page: "Why Us",
    label: "Our pillars",
    hint: "The main reasons, shown as cards.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: WHYUS_PILLARS,
  },
  {
    key: "whyus.advantages",
    page: "Why Us",
    label: "Advantages list",
    hint: "The tick-list of advantages.",
    fields: [T("text", "Advantage")],
    items: WHYUS_ADVANTAGES,
  },
  {
    key: "partner.stats",
    page: "Partner",
    label: "Headline figures",
    hint: "The figures at the top of the page.",
    fields: [T("value", "Figure"), T("label", "Label")],
    items: PARTNER_STATS,
  },
  {
    key: "partner.highlights",
    page: "Partner",
    label: "Hero highlights",
    hint: "Short points beside the headline.",
    fields: [T("text", "Point")],
    items: PARTNER_HIGHLIGHTS,
  },
  {
    key: "partner.segments",
    page: "Partner",
    label: "Who can partner",
    hint: "The kinds of professionals we work with.",
    fields: [I("icon", "Icon"), T("title", "Who"), A("body", "Why it fits")],
    items: PARTNER_SEGMENTS,
  },
  {
    key: "partner.steps",
    page: "Partner",
    label: "How it works",
    hint: "The steps of a referral.",
    fields: [I("icon", "Icon"), T("title", "Step"), A("body", "Description")],
    items: PARTNER_STEPS,
  },
  {
    key: "partner.benefits",
    page: "Partner",
    label: "Benefits",
    hint: "What a partner gets.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: PARTNER_BENEFITS,
  },
  {
    key: "partner.reasons",
    page: "Partner",
    label: "More reasons (questions)",
    hint: "Expandable reasons, question and answer.",
    fields: [T("q", "Heading"), A("a", "Text")],
    items: PARTNER_REASONS,
  },
  {
    key: "services.stats",
    page: "Services",
    label: "Headline figures",
    hint: "The figures at the top of the page.",
    fields: [T("value", "Figure"), T("label", "Label")],
    items: SERVICES_STATS,
  },
  {
    key: "home.concerns",
    page: "Home & Why Us",
    label: "Common concerns",
    hint: "The flip cards: the worry on the front, how we handle it on the back.",
    fields: [T("question", "Worry"), A("answer", "How we handle it")],
    items: PAIN_POINTS,
  },
  {
    key: "nav.header",
    page: "Menu & footer",
    label: "Top menu",
    hint: "The links in the top menu. Our Services and Tools keep their drop-down panels.",
    fields: [T("label", "Name"), T("to", "Page address, e.g. /about")],
    items: NAV_HEADER,
  },
  {
    key: "nav.tools",
    page: "Menu & footer",
    label: "Tools drop-down",
    hint: "The calculators listed under Tools.",
    fields: [T("label", "Name"), T("desc", "Short line"), T("hash", "Calculator id")],
    items: NAV_TOOLS,
  },
  {
    key: "footer.explore",
    page: "Menu & footer",
    label: "Footer: Explore links",
    hint: "The Explore column in the footer.",
    fields: [T("label", "Name"), T("to", "Page address, e.g. /about")],
    items: FOOTER_EXPLORE,
  },
  {
    key: "footer.products",
    page: "Menu & footer",
    label: "Footer: Loan products",
    hint: "The Loan Products column in the footer.",
    fields: [T("label", "Name"), T("to", "Page address, e.g. /services#home-loan")],
    items: FOOTER_PRODUCTS,
  },
  {
    key: "form.loanTypes",
    page: "Forms",
    label: "Enquiry form: loan types",
    hint: "The loan types in the enquiry form. The website slug (e.g. home-loan) files the enquiry under that loan in the CRM.",
    fields: [T("title", "Name shown"), T("slug", "Website slug")],
    items: FORM_LOAN_TYPES,
  },
  {
    key: "form.cities",
    page: "Forms",
    label: "Cities we serve",
    hint: "Used in the enquiry form drop-down and the footer.",
    fields: [T("city", "City")],
    items: FORM_CITIES,
  },
  {
    key: "home.banks",
    page: "Home",
    label: "Bank and lender logos",
    hint: "The scrolling strip. Upload a logo (PNG, JPG or WebP); tick Small for very wide logos.",
    fields: [T("name", "Bank or lender"), G("logo", "Logo"), T("small", "Small? type yes")],
    items: BANKS,
  },
  {
    key: "home.goals",
    page: "Home",
    label: "What are you planning? (goal cards)",
    hint: "Cards are grouped by the category name; the order here is the order shown.",
    fields: [
      T("category", "Category"),
      I("icon", "Icon"),
      T("goal", "Goal"),
      T("product", "Loan name"),
      T("slug", "Loan page slug"),
      A("line", "One-line description"),
      T("featured", "Most popular? type yes"),
    ],
    items: HOME_GOALS,
  },
  {
    key: "tools.cards",
    page: "Tools",
    label: "Calculator cards",
    hint: "Reword or reorder the calculators. They cannot be added or removed here.",
    fixed: true,
    fields: [R("id", "Calculator"), T("label", "Name"), T("sub", "Short line")],
    items: TOOLS_CARDS,
  },
  {
    key: "services.groups",
    page: "Services",
    label: "Loan groups",
    hint: "The heading and description above each group of loans.",
    fixed: true,
    fields: [R("name", "Group"), T("heading", "Heading"), A("description", "Description")],
    items: SERVICES_GROUPS,
  },
  {
    key: "cibil.bureaus",
    page: "CIBIL",
    label: "Credit bureaus",
    hint: "Names and one-line descriptions on the CIBIL page.",
    fixed: true,
    fields: [R("id", "Bureau"), T("name", "Name"), T("blurb", "Description")],
    items: CIBIL_BUREAUS,
  },
  {
    key: "cibil.lastPulled",
    page: "CIBIL",
    label: "'When did you last take a report?' options",
    hint: "The wording of the three choices.",
    fixed: true,
    fields: [R("id", "Option"), T("label", "Choice"), T("hint", "Helper text")],
    items: CIBIL_LAST_PULLED,
  },
  {
    key: "cities.pages",
    page: "City pages",
    label: "City pages",
    hint: "Intro and service note for Mumbai, Thane, Navi Mumbai and Pune. Type yes or no for whether we have an office there.",
    fixed: true,
    fields: [
      R("slug", "Page"),
      T("city", "City"),
      A("intro", "Introduction"),
      A("serviceNote", "Service note"),
      T("hasOffice", "Office there? yes or no"),
    ],
    items: CITY_PAGES,
  },
  {
    key: "calc.stampDuty",
    page: "Calculators",
    label: "Stamp duty by state",
    hint: "Percentages. Leave the women's rate empty if there is none.",
    fields: [
      T("state", "State"),
      T("stampDuty", "Stamp duty %"),
      T("stampDutyFemale", "Women's stamp duty %"),
      T("registration", "Registration %"),
    ],
    items: CALC_STAMP_DUTY,
  },
  {
    key: "calc.assumptions",
    page: "Calculators",
    label: "Calculator assumptions",
    hint: "Numbers the calculators start from or assume.",
    fixed: true,
    fields: [R("label", "Setting"), T("value", "Value")],
    items: CALC_ASSUMPTIONS,
  },
];
