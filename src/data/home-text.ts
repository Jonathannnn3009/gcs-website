// The wording on the Home page that is not part of a repeated block: headings, the opening
// statement, buttons and so on. Staff change it in the CRM (Settings -> Home page); wherever they
// have not, the text here is used. Repeated blocks (hero points, steps, personas...) are lists, see page-lists.ts.

export type HomeTextField = { id: string; label: string; text: string; long?: boolean };
export type HomeTextSection = {
  id: string;
  label: string;
  hint: string;
  fields: HomeTextField[];
};

export const HOME_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening section",
    hint: "The first thing visitors see, next to the consultation form.",
    fields: [
      { id: "hero.eyebrow", label: "Small line above the headline", text: "Trusted Loan Experts — Since 2017" },
      { id: "hero.line1", label: "Headline, first line", text: "Your Growth," },
      { id: "hero.line2", label: "Headline, second line (gold)", text: "Our Financial Expertise." },
      {
        id: "hero.intro",
        label: "Paragraph under the headline",
        text: "We help you compare loan options from 75+ Banks and NBFCs and guide you from the first call to the final paperwork. Honest advice, in simple words.",
        long: true,
      },
      { id: "hero.primary", label: "Main button", text: "Explore Loan Products" },
      { id: "hero.secondary", label: "WhatsApp link", text: "Talk to an Expert" },
      { id: "hero.badge", label: "Badge on the form", text: "75+ Banks & NBFCs" },
    ],
  },
  {
    id: "advisor",
    label: "Loan expert banner",
    hint: "The dark banner that sends visitors to the short questions.",
    fields: [
      { id: "advisor.eyebrow", label: "Small line", text: "GCS Loan Expert" },
      { id: "advisor.title", label: "Heading", text: "Not sure which loan fits? Answer a few short questions." },
      {
        id: "advisor.body",
        label: "Text",
        text: "Tell us what you need and a GCS loan expert will look at the options that may suit your profile.",
        long: true,
      },
      { id: "advisor.button", label: "Button", text: "Start now" },
    ],
  },
  {
    id: "services",
    label: "Our services",
    hint: "The heading above the loan goal cards.",
    fields: [
      { id: "services.eyebrow", label: "Small line", text: "Our Services" },
      { id: "services.title", label: "Heading", text: "Financing for Every Goal" },
      {
        id: "services.body",
        label: "Text",
        text: "Loan products organized by what you're trying to achieve — home, business or personal.",
        long: true,
      },
    ],
  },
  {
    id: "who",
    label: "Who we serve",
    hint: "The heading above the situation tabs and the client stories.",
    fields: [
      { id: "who.eyebrow", label: "Small line", text: "Who We Serve" },
      { id: "who.title", label: "Heading", text: "Real people. Real plans. The right loan." },
      {
        id: "who.body",
        label: "Text",
        text: "Pick your situation — see the loan we'd shape for you, and the reason clients like you choose Growth Capital.",
        long: true,
      },
      { id: "who.stories", label: "Label above the client stories", text: "Real Clients, Real Outcomes" },
    ],
  },
  {
    id: "why",
    label: "Why Growth Capital",
    hint: "The heading above the comparison with banks.",
    fields: [
      { id: "why.eyebrow", label: "Small line", text: "Why Growth Capital" },
      {
        id: "why.title",
        label: "Heading",
        text: "A lender offers you a loan. We help you pick the right one.",
      },
    ],
  },
  {
    id: "how",
    label: "How it works",
    hint: "The heading above the steps.",
    fields: [
      { id: "how.eyebrow", label: "Small line", text: "How It Works" },
      { id: "how.title", label: "Heading", text: "From hello to disbursal in four steps" },
    ],
  },
  {
    id: "concerns",
    label: "Common concerns",
    hint: "The heading above the worry cards.",
    fields: [
      { id: "concerns.eyebrow", label: "Small line", text: "Common Concerns" },
      { id: "concerns.title", label: "Heading", text: "The worries we take off your plate" },
      {
        id: "concerns.body",
        label: "Text",
        text: "Real questions we hear before someone signs — and how we handle each one.",
        long: true,
      },
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action near the bottom. The phone number and hours under it come from Contact & CIBIL.",
    fields: [
      { id: "cta.title", label: "Heading", text: "Ready to move your loan" },
      { id: "cta.gold", label: "Last word of the heading (gold)", text: "forward?" },
      { id: "cta.primary", label: "Main button", text: "Apply Now" },
      { id: "cta.secondary", label: "WhatsApp button", text: "WhatsApp Us" },
    ],
  },
  {
    id: "network",
    label: "Banks in our network",
    hint: "The heading above the bank logos.",
    fields: [
      { id: "network.eyebrow", label: "Small line", text: "Our Network" },
      { id: "network.title", label: "Heading", text: "Banks in our network" },
      {
        id: "network.body",
        label: "Text",
        text: "We compare offers across major Banks and NBFCs so you can choose with confidence, without the legwork.",
        long: true,
      },
    ],
  },
];

/** Every field's built-in text, by id. */
export const HOME_TEXT: Record<string, string> = Object.fromEntries(
  HOME_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
