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
import { PAIN_POINTS } from "@/data/site";

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

export type FieldSpec = { key: string; label: string; kind: "text" | "textarea" | "icon" };
export type ListItem = Record<string, string | LucideIcon>;
export type ListSpec = {
  key: string;
  page: string;
  label: string;
  hint: string;
  fields: FieldSpec[];
  items: ListItem[];
};

const T = (key: string, label: string): FieldSpec => ({ key, label, kind: "text" });
const A = (key: string, label: string): FieldSpec => ({ key, label, kind: "textarea" });
const I = (key: string, label: string): FieldSpec => ({ key, label, kind: "icon" });

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
];
