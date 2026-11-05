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
  Gauge,
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
  Calculator,
  ClipboardCheck,
  FileSearch,
  Languages,
  Layers,
  LineChart,
  ListChecks,
  MessageCircle,
  Network,
  SearchCheck,
  Smartphone,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { BANK_PARTNERS, CONTACT, PAIN_POINTS, SERVICES } from "@/data/site";
import { BUREAUS, LAST_PULLED_OPTIONS } from "@/data/cibil";
import { LOCATIONS } from "@/data/locations";
import { CALEGAL_STEPS } from "@/data/more-page-text";
import {
  APPLICANT_CATEGORY_LABELS,
  PRODUCT_GROUPS,
  PRODUCTS,
  type ChecklistIntakeField,
} from "@/data/products";
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
  { icon: BadgeCheck, label: "No Hidden Charges" },
  { icon: Globe, label: "PAN India Service" },
  { icon: LayoutDashboard, label: "In-House CRM Tracking" },
];

// "Banks & Lenders vs Growth Capital Services" comparison on the home page.
export const HOME_COMPARE_BANKS = [
  { text: "Only their own loan products on the table" },
  { text: "One standard answer for every borrower" },
  { text: "You chase the paperwork and the updates yourself" },
  { text: "Charges tucked away in the sanction letter" },
  { text: "Sales targets shape the advice" },
];

export const HOME_COMPARE_US = [
  { text: "Offers compared across 75+ banks and NBFCs" },
  { text: "A loan shaped around your income and goals" },
  { text: "One dedicated manager from login to disbursal" },
  { text: "Every charge shared in writing before you sign" },
  { text: "No hidden charges, independent advice" },
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
    whyBody: "One expert from picking the product to after the money lands.",
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
  { value: "27+", label: "Loan Products" },
  { value: "100%", label: "Transparent Process" },
];

export const ABOUT_WHY = [
  {
    title: "Real Choice, Not One Bank",
    body: "We work with 75+ banks and NBFCs, so your file has more than one chance to get approved.",
  },
  {
    title: "Senior Experts, Not a Call Centre",
    body: "The same experienced expert looks after your file from the first call until the money reaches you.",
  },
  {
    title: "Built For Speed",
    body: "We get your papers and loan details right the first time, so your approval is not delayed.",
  },
  {
    title: "Nothing Hidden",
    body: "The interest rate, fees and terms are given to you in writing before you sign anything.",
  },
  {
    title: "Planned Around You",
    body: "Your loan is planned around your own income and needs, not forced into a bank's fixed format.",
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
  { text: "No hidden charges: every fee shared in writing first" },
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
    body: "A senior expert reaches out, assesses eligibility and manages the file.",
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
    a: "Unlike a registered loan agent, you don't need any certification to refer clients to us — just an introduction and a phone number. Our licensed experts handle the lending process end to end.",
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
    a: "Every successful referral builds a track record with senior experts across our network of 75+ banks and NBFCs.",
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
  { label: "Calculators", to: "/tools" },
  { label: "CIBIL", to: "/cibil" },
  { label: "CA & Legal", to: "/ca-legal-services" },
  { label: "Become Partner", to: "/partner" },
  { label: "Track Application", to: "/track-application" },
];

export const NAV_PARTNER = [
  { icon: Handshake, label: "Agent", desc: "CAs, brokers, consultants and DSAs", to: "/partner" },
  {
    icon: Building2,
    label: "Builder",
    desc: "Buyer financing and project approvals",
    to: "/partner/builder",
  },
  {
    icon: Users,
    label: "Freelancer",
    desc: "Earn on your own time, no investment",
    to: "/partner/freelancer",
  },
];

export const NAV_CIBIL = [
  {
    icon: FileText,
    label: "Credit Report",
    desc: "Request your CIBIL or other bureau report",
    to: "/cibil",
  },
  {
    icon: Gauge,
    label: "Credit Score Estimator",
    desc: "An indicative range, not a bureau pull",
    to: "/credit-score-estimator",
  },
  {
    icon: Compass,
    label: "CIBIL Advisory Services",
    desc: "Understand your report and plan the next steps",
    to: "/cibil-advisory",
  },
];

export const NAV_TOOLS = [
  { label: "EMI Calculator", desc: "Monthly payment", hash: "emi" },
  { label: "Loan Eligibility", desc: "Maximum loan amount", hash: "eligibility" },
  {
    label: "Loan Balance Transfer",
    desc: "Is switching lenders worth it",
    hash: "balance-transfer",
  },
  { label: "Loan Comparison", desc: "Compare offers side by side", hash: "loan-comparison" },
  { label: "Loan Prepayment", desc: "Interest savings", hash: "prepayment" },
  { label: "Money Saver", desc: "Interest saved on spare cash", hash: "money-saver" },
  { label: "Loan Against Property – LTV", desc: "What your property can unlock", hash: "lap-ltv" },
  {
    label: "Working Capital Estimator",
    desc: "MSME limit, GCS exclusive",
    hash: "working-capital",
  },
  { label: "CGTMSE Guarantee Fee", desc: "Fee on a collateral-free loan", hash: "cgtmse" },
  { label: "Stamp Duty", desc: "Property registration", hash: "stamp-duty" },
];

export const FOOTER_EXPLORE = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "EMI Calculator", to: "/tools" },
  { label: "Interest Rates", to: "/rates" },
  { label: "CIBIL Report", to: "/cibil" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "CA & Legal Services", to: "/ca-legal-services" },
  { label: "Become Partner", to: "/partner" },
  { label: "Track Application", to: "/track-application" },
  { label: "Contact Us", to: "/contact" },
];

export const FOOTER_PRODUCTS = SERVICES.slice(0, 8).map((s) => ({
  label: s.title,
  to: `/services#${s.id}`,
}));

// The enquiry form's loan types on the home, contact and other general pages: every loan that has its own page, in
// the same order as the Our Services menu. (On a loan's own page the loan is fixed, not chosen.)
const FORM_LOAN_ORDER = [
  // Property finance
  "home-loan",
  "balance-transfer",
  "loan-against-property",
  "micro-lap",
  "lease-rental-discounting",
  "dlod",
  "project-funding",
  // Business growth
  "business-loan",
  "micro-business-loan",
  "unsecured-dod",
  "professional-loan",
  "private-funding",
  // Cash flow and trade
  "cgtmse",
  "machine-loan",
  "working-capital-term-loan",
  "cash-credit",
  "overdraft-limit",
  "bank-guarantee",
  "letter-of-credit",
  "bill-discounting",
  // Personal, education, vehicle and other
  "personal-loan",
  "education-loan",
  "education-infrastructure-loan",
  "new-car-loan",
  "used-car-loan",
  "car-refinance",
  "commercial-vehicle",
  "loan-against-securities",
];
// The overdraft is filed in the CRM under its older name.
const FORM_LOAN_SLUG: Record<string, string> = { "overdraft-limit": "overdraft-facility" };
export const FORM_LOAN_TYPES = [
  ...FORM_LOAN_ORDER.flatMap((slug) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    return p ? [{ title: p.title, slug: FORM_LOAN_SLUG[slug] ?? slug }] : [];
  }),
  // a loan added later that is not in the menu order yet still appears, at the end
  ...PRODUCTS.filter((p) => !FORM_LOAN_ORDER.includes(p.slug)).map((p) => ({
    title: p.title,
    slug: p.slug,
  })),
];

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
    goal: "Buy, Build or Create Your Dream Home",
    product: "Home Loan",
    line: "Finance your ready or under-construction home, plot purchase or self-construction. We help you compare suitable loan options from multiple Banks & NBFCs based on your profile.",
    featured: "yes",
  },
  {
    category: "Home & Property",
    slug: "loan-against-property",
    icon: Building2,
    goal: "Get Funds Against Your Property",
    product: "Loan Against Property",
    line: "Use your owned residential, commercial, industrial or specialised property to raise funds while continuing to use it.",
    featured: "",
  },
  {
    category: "Home & Property",
    slug: "balance-transfer",
    icon: TrendingDown,
    goal: "Lower your EMI",
    product: "Balance Transfer & Top-Up",
    line: "Compare other lenders and move your loan if better terms are available. A top-up may be possible.",
    featured: "",
  },
  {
    category: "Business & Cash Flow",
    slug: "business-loan",
    icon: Briefcase,
    goal: "Grow your business",
    product: "Business Loan",
    line: "Unsecured funds for business expansion, stock purchase, renovation, and short-term cash flow needs.",
    featured: "",
  },
  {
    category: "Business & Cash Flow",
    slug: "working-capital-term-loan",
    icon: RefreshCw,
    goal: "Keep your cash flowing",
    product: "Working Capital Term Loan",
    line: "Working capital term loans, cash credit, overdraft and bill discounting to match your business cycle.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "personal-loan",
    icon: Wallet,
    goal: "Fund a personal plan",
    product: "Personal Loan",
    line: "For a wedding, travel or medical needs. No collateral needed.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "new-car-loan",
    icon: Car,
    goal: "Buy a new car",
    product: "Car Loan",
    line: "Finance for a new or used car, up to 100% of the on-road price for eligible profiles.",
    featured: "",
  },
  {
    category: "Personal Goals",
    slug: "education-loan",
    icon: GraduationCap,
    goal: "Fund your education, build your future",
    product: "Education Loan",
    line: "Get financial support for higher education in India or abroad, including tuition fees, accommodation, travel and other eligible education expenses.",
    featured: "",
  },
];

export const TOOLS_CARDS = [
  { id: "emi", label: "EMI Calculator", sub: "Monthly payment" },
  { id: "eligibility", label: "Loan Eligibility", sub: "Maximum loan amount" },
  { id: "balance-transfer", label: "Loan Balance Transfer", sub: "Is switching lenders worth it" },
  { id: "loan-comparison", label: "Loan Comparison", sub: "Compare offers side by side" },
  { id: "prepayment", label: "Loan Prepayment", sub: "Interest savings" },
  { id: "money-saver", label: "Money Saver", sub: "Interest saved on spare cash" },
  { id: "lap-ltv", label: "Loan Against Property – LTV", sub: "What your property can unlock" },
  { id: "working-capital", label: "Working Capital Estimator", sub: "Business limit estimate" },
  { id: "cgtmse", label: "CGTMSE Guarantee Fee", sub: "Fee on a collateral-free business loan" },
  { id: "stamp-duty", label: "Stamp Duty", sub: "Property registration" },
];

export const SERVICES_GROUPS = PRODUCT_GROUPS.map((g) => ({
  name: g.name,
  heading: g.heading,
  description: g.description,
}));

/** The four steps above the CIBIL request form. The icons stay in the page, one per step. */
export const CIBIL_STEPS = [
  { title: "Share your details", text: "PAN, date of birth and address, exactly as on your records." },
  { title: "Choose your bureau", text: "TransUnion CIBIL, Experian, Equifax or CRIF High Mark." },
  { title: "Tell us your last report", text: "A quick question so we have the full picture." },
  {
    title: "Pay by UPI QR",
    text: "One flat price for any bureau. We pull your report and send it to you.",
  },
];

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

export const FORM_APPLICANTS = APPLICANT_CATEGORY_LABELS.map((label) => ({ label }));

export const PRODUCTS_VISIBILITY = PRODUCTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  visible: "yes",
}));

export const INTAKE_FIELDS = PRODUCTS.flatMap((p) =>
  (p.checklistIntake ?? []).map((f: ChecklistIntakeField) => ({
    slug: p.slug,
    key: f.key,
    label: f.label,
    type: f.type,
    options: f.type === "select" ? f.options.join(", ") : "",
    placeholder: f.type === "text" ? (f.placeholder ?? "") : "",
    amount: f.type === "text" && f.format === "amount" ? "yes" : "",
    showWhenKey: f.showWhen?.key ?? "",
    showWhenValues: f.showWhen?.values.join(", ") ?? "",
  })),
);

export type FieldSpec = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "icon" | "image" | "readonly" | "yesno";
};
/** The "Which kind of lender may suit you?" table: one row per factor, three lender kinds across. */
export const HOME_LENDERS = [
  {
    icon: Percent,
    label: "How the interest rate is set",
    v1: "Often follows a published benchmark",
    v2: "Can respond more to the market",
    v3: "Often based on your profile",
  },
  {
    icon: FileText,
    label: "Documents and checks",
    v1: "Usually step by step, with set checks",
    v2: "Often led by the relationship",
    v3: "Often more flexible on proofs",
  },
  {
    icon: Briefcase,
    label: "Support for self-employed applicants",
    v1: "Usually more selective",
    v2: "Moderate",
    v3: "Often stronger",
  },
  { icon: Clock, label: "Time to process", v1: "Can take longer", v2: "Often quicker", v3: "Can be quick" },
  { icon: Handshake, label: "Room to negotiate", v1: "Usually limited", v2: "Sometimes possible", v3: "Case by case" },
];

/** The tick points in the Contact page's opening panel. */
export const CONTACT_BENEFITS = [
  { text: "Callback from a senior expert within one business day" },
  { text: "Indicative offer & lender shortlist within 48 hours" },
  { text: "No hidden charges — every fee is shared in writing before you go ahead" },
  { text: "Full confidentiality on profile, file and amount" },
];

// Cards and tick lists on the partner pages and the CIBIL Advisory page (editable in the CRM).
export const PARTNER_WHAT_WE_DO: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Layers,
    title: "75+ lenders, one desk",
    body: "Offer your clients the right bank or NBFC for their profile, without sending them from branch to branch.",
  },
  {
    icon: Wallet,
    title: "Clear, written payouts",
    body: "Commission by loan type is shown up front, and your share is settled once the loan disburses.",
  },
  {
    icon: UserCheck,
    title: "One contact who handles the file",
    body: "A named expert looks after login, documents and bank follow-ups, and keeps you informed.",
  },
  {
    icon: GraduationCap,
    title: "Guidance as you start",
    body: "A short walk-through of our loan products and what to share, and answers whenever you need them.",
  },
];
export const PARTNER_WHY_CHOOSE: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Languages,
    title: "In your clients' language",
    body: "Our website reads in English, Hindi and Marathi, and we speak to clients in the language they are comfortable with.",
  },
  {
    icon: Briefcase,
    title: "Salaried and self-employed",
    body: "Whether your clients draw a salary or run a business, we have loan options and lenders for both.",
  },
  {
    icon: MapPin,
    title: "Rooted in Mumbai, Thane & Pune",
    body: "Experts who know the local banks, builders and projects, so your clients are not treated as a number.",
  },
];
export const PARTNER_ASSISTANT: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ListChecks,
    title: "Check eligibility",
    body: "A client's likely loan amount from their income and obligations, in a minute.",
  },
  {
    icon: Calculator,
    title: "Work out the EMI",
    body: "EMI, total interest and the effect of a part-payment, worked out instantly.",
  },
  {
    icon: FileText,
    title: "Documents and rates",
    body: "The documents each profile needs, and indicative rates and charges.",
  },
  {
    icon: MessageCircle,
    title: "Hand-off to an expert",
    body: "If a client wants a call, the request lands straight in our CRM with a short summary.",
  },
];
export const PARTNER_GET_STARTED: { title: string; body: string }[] = [
  {
    title: "Register with us",
    body: "Fill the short form on this page. A member of our team calls you to set up your partnership.",
  },
  {
    title: "Refer a case",
    body: "Send your client's name, number and requirement. Our expert checks eligibility and matches the case with suitable lenders from 75+.",
  },
  {
    title: "Sit back and get paid",
    body: "We run the loan process while you carry on with your work. Your payout follows each disbursal.",
  },
];
export const BUILDER_WHAT_WE_DO: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ClipboardCheck,
    title: "Project approvals with lenders",
    body: "We take your project through lender approval so buyers can be financed without delay.",
  },
  {
    icon: Landmark,
    title: "One desk, many lenders",
    body: "Each buyer is matched to the bank or NBFC that suits their profile, instead of a single option.",
  },
  {
    icon: LayoutDashboard,
    title: "Tracked file by file",
    body: "Every buyer's loan is tracked in our in-house CRM, with status your sales team can ask for any time.",
  },
  {
    icon: Users,
    title: "Help on the ground",
    body: "Document collection and follow-ups handled by our team, so your sales staff can keep selling.",
  },
];
export const BUILDER_POINTS: { text: string }[] = [
  { text: "One point of contact for every lender, with no juggling of banks and agents" },
  { text: "A clear status on each buyer's loan, from login to sanction to disbursal" },
  { text: "A finance executive at your sales office when a launch needs one" },
  { text: "Lender approvals for your project managed across banks in one place" },
];
export const BUILDER_STEPS: { title: string; body: string }[] = [
  {
    title: "Share your project",
    body: "Tell us about the project, its stage, the units on offer and how you sell.",
  },
  {
    title: "We line up the lenders",
    body: "We approach suitable banks and NBFCs for project approval and buyer financing.",
  },
  {
    title: "Buyers get their loans",
    body: "Your buyers are guided from eligibility to sanction by one named expert.",
  },
  {
    title: "Disbursals follow your milestones",
    body: "We track each file so releases line up with your construction and collection schedule.",
  },
];
export const BUILDER_WHY: { title: string; body: string }[] = [
  {
    title: "Support from project approval to disbursal",
    body: "The paperwork around lender approval and the buyers' loans sits with one team, so nothing falls between desks.",
  },
  {
    title: "An independent view across lenders",
    body: "We are not tied to a single bank, so each buyer is steered to the lender most likely to say yes on good terms.",
  },
  {
    title: "Your sales team stays on sales",
    body: "Eligibility questions, document lists and bank follow-ups come to us, not to your booking desk.",
  },
  {
    title: "Works with how you already sell",
    body: "We coordinate with your sales team, your CRM contacts and your channel partners rather than asking you to change anything.",
  },
  {
    title: "Zero advisory fee to your buyers",
    body: "Buyers are not charged for our advice, which helps conversions and keeps goodwill high.",
  },
];
export const BUILDER_MODELS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Handshake,
    title: "Direct",
    body: "We deal with your buyers directly once they book, and keep your team informed.",
  },
  {
    icon: Network,
    title: "Channel-partner led",
    body: "Your channel partners bring the buyer; we run the loan and keep everyone updated.",
  },
  {
    icon: Building2,
    title: "Hybrid",
    body: "A mix of both, set up project by project to fit how each launch is sold.",
  },
];
export const BUILDER_ASSISTANT: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Clock,
    title: "Answers at any hour",
    body: "Buyers get replies on loans, documents and rates when they are browsing, not only in office hours.",
  },
  {
    icon: Calculator,
    title: "Instant eligibility and EMI",
    body: "A buyer can see a likely loan amount and monthly EMI in a minute, before they visit your site office.",
  },
  {
    icon: MessageCircle,
    title: "A straight line to an expert",
    body: "When a buyer wants a call, the request reaches our team with a short summary of the chat.",
  },
  {
    icon: LayoutDashboard,
    title: "Tracked in our CRM",
    body: "Each enquiry becomes a file in our CRM, so the follow-up is never lost between your sales desk and ours.",
  },
];
export const FREELANCER_WHO: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Home,
    title: "Homemakers",
    body: "Earn from home, around your own schedule, using people you already know.",
  },
  {
    icon: GraduationCap,
    title: "Students & fresh graduates",
    body: "A first source of income and a real look at how finance works.",
  },
  {
    icon: Landmark,
    title: "Retired bankers & professionals",
    body: "Put your reputation and years of contacts to work again, without the 9-to-5.",
  },
  {
    icon: Smartphone,
    title: "Salaried, with time to spare",
    body: "Keep your job and add a second income from evenings and weekends.",
  },
  {
    icon: Store,
    title: "Shop & small-business owners",
    body: "Customers and neighbours ask about loans all the time. Now you can help them.",
  },
  {
    icon: Heart,
    title: "Community connectors",
    body: "Society members, tutors, tailors, agents of all kinds: anyone people trust and talk to.",
  },
];
export const FREELANCER_STEPS: { title: string; body: string }[] = [
  {
    title: "Sign up",
    body: "Fill in the short form. It takes about two minutes and costs nothing.",
  },
  {
    title: "Quick orientation",
    body: "A team member walks you through the loans we offer and exactly what to share.",
  },
  { title: "Refer", body: "Send us a name, number and requirement whenever someone needs a loan." },
  { title: "Get paid", body: "Your payout is settled once the loan is disbursed." },
];
export const FREELANCER_PERKS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Wallet,
    title: "Nothing to invest",
    body: "No joining fee, no deposit, no stock. Referring is free.",
  },
  {
    icon: Clock,
    title: "Your hours, no targets",
    body: "Refer one person a month or ten. There is no minimum and no lock-in.",
  },
  {
    icon: Check,
    title: "No licence needed",
    body: "Our experts handle the lending side, so you only make the introduction.",
  },
  {
    icon: UserRound,
    title: "A person to call",
    body: "A dedicated contact answers your questions and updates you on each case.",
  },
  {
    icon: Landmark,
    title: "75+ lenders behind you",
    body: "The people you refer get more chances of approval than at a single bank.",
  },
  {
    icon: Rocket,
    title: "Room to grow",
    body: "Referring regularly? You can step up to our Agent partnership with a fuller set-up.",
  },
];
export const FREELANCER_ASSISTANT: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Calculator,
    title: "Quick numbers for anyone you help",
    body: "Work out a person's likely EMI or loan amount on the spot, so you can answer them with confidence.",
  },
  {
    icon: FileText,
    title: "What to ask for",
    body: "See which documents and details a person needs before you pass their requirement to us.",
  },
  {
    icon: UserRound,
    title: "No finance background needed",
    body: "Ask in plain words. It explains loan terms simply, so you never have to pretend to know.",
  },
  {
    icon: MessageCircle,
    title: "Hand over to our team",
    body: "When the person is ready, the assistant passes their details to an expert and we take it from there.",
  },
];
export const ADVISORY_WHY_CREDIT: { text: string }[] = [
  { text: "May improve your chances of loan approval" },
  { text: "May help you get a lower interest rate" },
  { text: "May open the way to higher credit limits" },
  { text: "Gives you access to more financial products" },
  { text: "Builds a stronger financial profile" },
];
export const ADVISORY_INDIVIDUALS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Gauge,
    title: "Credit Score Guidance & Monitoring",
    text: "A step-by-step plan to work on your score, with regular check-ins on how it is moving.",
  },
  {
    icon: FileSearch,
    title: "Credit Report Review & Error Spotting",
    text: "We go through your report, spot mistakes and guide you on getting them corrected with the bureau.",
  },
  {
    icon: Handshake,
    title: "Loan Assistance & Financial Advisory",
    text: "Help choosing the right loan or card for your profile, with options compared from 75+ Banks and NBFCs.",
  },
  {
    icon: GraduationCap,
    title: "Credit Education & Guidance",
    text: "Plain-language advice on dues, closed accounts and credit use, so you stay credit healthy.",
  },
];
export const ADVISORY_INDIVIDUAL_BENEFITS: { text: string }[] = [
  { text: "See your credit score clearly" },
  { text: "Know why a loan was turned down" },
  { text: "Get expert guidance on fixing issues" },
  { text: "Be ready to apply, sooner" },
];
export const ADVISORY_BUSINESSES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Building2,
    title: "Commercial Credit Report (CMR) Review",
    text: "We explain your Commercial Credit Report and your CIBIL MSME Rank (CMR) in simple words.",
  },
  {
    icon: Briefcase,
    title: "Business Credit Advisory",
    text: "Guidance on building your business credit, and what lenders look at before they lend.",
  },
  {
    icon: LineChart,
    title: "Credit Rating Guidance",
    text: "A focused plan to work on your CMR (1 is the lowest risk, 10 the highest).",
  },
  {
    icon: ClipboardCheck,
    title: "Loan Assistance for Business / MSME",
    text: "Get funding-ready and approach the right lenders for your business needs.",
  },
];
export const ADVISORY_BUSINESS_BENEFITS: { text: string }[] = [
  { text: "Get ready for MSME loans" },
  { text: "Understand your business rating" },
  { text: "Be better placed for lender terms" },
  { text: "Plan your business growth" },
];
export const ADVISORY_AUDIENCE: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UserCheck, title: "Salaried people", text: "Planning a home, car or personal loan and want to know where they stand." },
  { icon: Briefcase, title: "Business owners", text: "Self-employed and professionals who need credit for their work." },
  { icon: Building2, title: "MSMEs", text: "Small and medium businesses who want to understand their business credit report." },
  { icon: ShieldCheck, title: "Anyone turned down", text: "People whose loan was declined and who want to know why, and what to do next." },
];
export const ADVISORY_STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: FileSearch, title: "Fetch your credit report", text: "We help you get your official report from the credit bureau, with your consent." },
  { icon: SearchCheck, title: "Analyse and spot issues", text: "Our team reads your report and marks errors or negative items." },
  { icon: ListChecks, title: "Prepare an action plan", text: "You get a clear plan, with the most important steps first." },
  { icon: Handshake, title: "Resolve and follow up", text: "We guide you on raising disputes with the bureau or lender, and on following them up." },
  { icon: TrendingUp, title: "Track your progress", text: "Keep an eye on your report as you work towards your target score." },
];

// The lists below were built into pages and are now editable in the CRM too.
export const FREELANCER_YOU: { text: string }[] = [
  { text: "Mention us when someone needs a loan" },
  { text: "Share their name, number and what they need" },
  { text: "Stay their friendly contact" },
];
export const FREELANCER_WE: { text: string }[] = [
  { text: "Call them and check eligibility" },
  { text: "Match them to the right bank or NBFC from 75+" },
  { text: "Collect documents and follow up with the lender" },
  { text: "Keep you updated until disbursal" },
];
export const THANK_YOU_STEPS: { title: string; body: string }[] = [
  { title: "We review", body: "A GCS loan expert reads your details." },
  { title: "We call you", body: "We contact you to understand your need and suggest next steps." },
  { title: "We compare", body: "We look at suitable Banks and NBFCs for your profile." },
];

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
const Y = (key: string, label: string): FieldSpec => ({ key, label, kind: "yesno" });

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
    key: "home.compare.banks",
    page: "Home",
    label: "Comparison: Banks & Lenders column",
    hint: "The points in the left column of the 'Banks & Lenders vs us' block.",
    fields: [T("text", "Point")],
    items: HOME_COMPARE_BANKS,
  },
  {
    key: "home.compare.us",
    page: "Home",
    label: "Comparison: Growth Capital column",
    hint: "The points in the highlighted right column.",
    fields: [T("text", "Point")],
    items: HOME_COMPARE_US,
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
    key: "home.lenders",
    page: "Home",
    label: "Which kind of lender: table rows",
    hint: "One row per factor. The three column names are set under Headings & buttons.",
    fields: [
      I("icon", "Icon"),
      T("label", "Factor"),
      T("v1", "First column"),
      T("v2", "Second column"),
      T("v3", "Third column"),
    ],
    items: HOME_LENDERS,
  },
  {
    key: "calegal.steps",
    page: "CA & Legal",
    label: "Steps beside the enquiry form",
    hint: "The three short steps shown next to the CA & Legal enquiry form.",
    fields: [T("title", "Step"), A("body", "Description")],
    items: CALEGAL_STEPS,
  },
  {
    key: "contact.benefits",
    page: "Contact",
    label: "Tick points in the opening panel",
    hint: "The short promises under the Call, WhatsApp and Email buttons.",
    fields: [T("text", "Point")],
    items: CONTACT_BENEFITS,
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
    hint: "The links in the top menu. Our Services, Calculators, CIBIL and Become Partner keep their drop-down panels.",
    fields: [T("label", "Name"), T("to", "Page address, e.g. /about")],
    items: NAV_HEADER,
  },
  {
    key: "nav.partner",
    page: "Menu & footer",
    label: "Become Partner drop-down",
    hint: "The partner types listed under Become Partner. Page address is e.g. /partner/builder.",
    fields: [
      I("icon", "Icon"),
      T("label", "Name"),
      T("desc", "Short line"),
      T("to", "Page address"),
    ],
    items: NAV_PARTNER,
  },
  {
    key: "nav.cibil",
    page: "Menu & footer",
    label: "CIBIL drop-down",
    hint: "The pages listed under CIBIL in the top menu.",
    fields: [
      I("icon", "Icon"),
      T("label", "Name"),
      T("desc", "Short line"),
      T("to", "Page address"),
    ],
    items: NAV_CIBIL,
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
    fields: [T("name", "Bank or lender"), G("logo", "Logo"), Y("small", "Small logo (very wide)")],
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
      Y("featured", "Most popular"),
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
    key: "cibil.steps",
    page: "CIBIL",
    label: "The four steps",
    hint: "The four cards above the request form. They follow the form's steps, so they can be reworded and reordered but not added to.",
    fixed: true,
    fields: [T("title", "Step"), A("text", "Description")],
    items: CIBIL_STEPS,
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
      Y("hasOffice", "We have an office there"),
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
  {
    key: "form.applicants",
    page: "Forms",
    label: "Enquiry form: applicant types",
    hint: "The 'applicant' choices in the enquiry form. (The checklist download keeps its own fixed Salaried / Self-Employed / NRI choices, which decide which PDF is served.)",
    fields: [T("label", "Choice")],
    items: FORM_APPLICANTS,
  },
  {
    key: "products.visibility",
    page: "Services",
    label: "Show or hide loan products",
    hint: "Untick a loan to take it off the website: its page, menu entries and cards disappear. Tick it again to bring it back.",
    fixed: true,
    fields: [R("title", "Loan"), R("slug", "Page"), Y("visible", "Show on the website")],
    items: PRODUCTS_VISIBILITY,
  },
  {
    key: "intake.fields",
    page: "Forms",
    label: "Checklist download: extra questions",
    hint: "Extra questions asked before a checklist downloads. Put the loan's website slug in each row (e.g. education-loan). Type is text, select or date; for select, list the options separated by commas. Keep the id (key) of an existing question unchanged; leave it empty on new ones. To show a question only after another one is answered, give that question's id and the answers that should reveal it.",
    fields: [
      T("slug", "Loan page slug"),
      T("label", "Question"),
      T("type", "Type: text, select or date"),
      T("options", "Options for select, separated by commas"),
      T("placeholder", "Example answer (text only)"),
      Y("amount", "Format as a rupee amount"),
      T("key", "Id (leave empty on new)"),
      T("showWhenKey", "Show only when this question (its id) ..."),
      T("showWhenValues", "... has one of these answers, separated by commas"),
    ],
    items: INTAKE_FIELDS,
  },
  {
    key: "partner.whatwedo",
    page: "Partner",
    label: "What we do for you",
    hint: "The four cards under 'What we do'.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: PARTNER_WHAT_WE_DO,
  },
  {
    key: "partner.whychoose",
    page: "Partner",
    label: "Why choose us",
    hint: "The three cards under 'Why choose us'.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: PARTNER_WHY_CHOOSE,
  },
  {
    key: "partner.assistant",
    page: "Partner",
    label: "Assistant: what it does",
    hint: "The points beside the chat assistant.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: PARTNER_ASSISTANT,
  },
  {
    key: "partner.getstarted",
    page: "Partner",
    label: "Get started: steps",
    hint: "The three steps under 'Get started'.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: PARTNER_GET_STARTED,
  },
  {
    key: "builder.whatwedo",
    page: "Builder Partner",
    label: "What we do for builders",
    hint: "The cards under 'What we do'.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: BUILDER_WHAT_WE_DO,
  },
  {
    key: "builder.points",
    page: "Builder Partner",
    label: "Tick points",
    hint: "The tick points beside the cards.",
    fields: [T("text", "Point")],
    items: BUILDER_POINTS,
  },
  {
    key: "builder.steps",
    page: "Builder Partner",
    label: "How it works",
    hint: "The numbered steps.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: BUILDER_STEPS,
  },
  {
    key: "builder.why",
    page: "Builder Partner",
    label: "Why us",
    hint: "The reasons to work with us.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: BUILDER_WHY,
  },
  {
    key: "builder.models",
    page: "Builder Partner",
    label: "Ways of working",
    hint: "The ways we can work with a builder.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: BUILDER_MODELS,
  },
  {
    key: "builder.assistant",
    page: "Builder Partner",
    label: "Assistant: what it does",
    hint: "The points beside the chat assistant.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: BUILDER_ASSISTANT,
  },
  {
    key: "freelancer.who",
    page: "Freelancer Partner",
    label: "Who it is for",
    hint: "The kinds of people who refer.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: FREELANCER_WHO,
  },
  {
    key: "freelancer.steps",
    page: "Freelancer Partner",
    label: "How it works",
    hint: "The numbered steps.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: FREELANCER_STEPS,
  },
  {
    key: "freelancer.perks",
    page: "Freelancer Partner",
    label: "Perks",
    hint: "The cards under 'Why join'.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: FREELANCER_PERKS,
  },
  {
    key: "freelancer.assistant",
    page: "Freelancer Partner",
    label: "Assistant: what it does",
    hint: "The points beside the chat assistant.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("body", "Text")],
    items: FREELANCER_ASSISTANT,
  },
  {
    key: "advisory.whycredit",
    page: "CIBIL Advisory",
    label: "Why a good credit score",
    hint: "The tick points on why credit matters.",
    fields: [T("text", "Point")],
    items: ADVISORY_WHY_CREDIT,
  },
  {
    key: "advisory.individuals",
    page: "CIBIL Advisory",
    label: "Services for individuals",
    hint: "The four service cards for individuals.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("text", "Text")],
    items: ADVISORY_INDIVIDUALS,
  },
  {
    key: "advisory.individualbenefits",
    page: "CIBIL Advisory",
    label: "Benefits strip: individuals",
    hint: "The four points in the strip under the individual services.",
    fields: [T("text", "Point")],
    items: ADVISORY_INDIVIDUAL_BENEFITS,
  },
  {
    key: "advisory.businesses",
    page: "CIBIL Advisory",
    label: "Services for businesses",
    hint: "The four service cards for businesses.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("text", "Text")],
    items: ADVISORY_BUSINESSES,
  },
  {
    key: "advisory.businessbenefits",
    page: "CIBIL Advisory",
    label: "Benefits strip: businesses",
    hint: "The four points in the strip under the business services.",
    fields: [T("text", "Point")],
    items: ADVISORY_BUSINESS_BENEFITS,
  },
  {
    key: "advisory.audience",
    page: "CIBIL Advisory",
    label: "Who it is for",
    hint: "The four kinds of people the advisory helps.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("text", "Text")],
    items: ADVISORY_AUDIENCE,
  },
  {
    key: "advisory.steps",
    page: "CIBIL Advisory",
    label: "The five steps",
    hint: "The numbered steps of how it works.",
    fields: [I("icon", "Icon"), T("title", "Heading"), A("text", "Text")],
    items: ADVISORY_STEPS,
  },
  {
    key: "freelancer.youdo",
    page: "Freelancer Partner",
    label: "What you do",
    hint: "The short list of what the freelancer does.",
    fields: [T("text", "Point")],
    items: FREELANCER_YOU,
  },
  {
    key: "freelancer.wedo",
    page: "Freelancer Partner",
    label: "What we do",
    hint: "The short list of what GCS does after the referral.",
    fields: [T("text", "Point")],
    items: FREELANCER_WE,
  },
  {
    key: "form.thanks",
    page: "Menu & footer",
    label: "Thank-you card: what happens next",
    hint: "The three boxes on the confirmation shown after any website form is sent.",
    fields: [T("title", "Heading"), A("body", "Text")],
    items: THANK_YOU_STEPS,
  },
];
