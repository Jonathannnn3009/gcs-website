// The wording that is the same on every loan page, every case study page and every CA & legal service
// page: headings, buttons and notes. Staff change it in the CRM (Settings -> Loan pages / Case study
// pages / CA & legal service pages); wherever they have not, the text here is used. The loan's own
// details, a case's own story and a service's own steps are edited where they always were.
// Tokens: {loan} the loan's name, {code} its short code, {group} its category, {title} a service's
// name, {category} a service's category, {phone} and {hours} from Contact & CIBIL.

import type { HomeTextSection } from "@/data/home-text";

const toMap = (sections: HomeTextSection[]): Record<string, string> =>
  Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f.text])));

const f = (id: string, label: string, text: string, long = false) => ({
  id,
  label,
  text,
  ...(long ? { long: true } : {}),
});

export const LOANPAGE_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "top",
    label: "Top of a loan page",
    hint: "The buttons and links in the dark card at the top. The small box beside it is At a glance.",
    fields: [
      f("top.apply", "Main button ({code} is the loan's short code)", "Apply for {code}"),
      f("top.whatsapp", "WhatsApp link", "or message on WhatsApp"),
      f("top.glance", "Heading of the At a glance box", "At A Glance"),
      f("top.seeAll", "Link under it, when there are more than five requirements ({count})", "See all {count} requirements"),
      f("top.seeNeeds", "Link under it, otherwise", "See what you will need"),
    ],
  },
  {
    id: "short",
    label: "The short version",
    hint: "The block that opens the page's main card. The loan's own description is under Loan product pages.",
    fields: [
      f("short.eyebrow", "Small line", "The Short Version"),
      f("short.title", "Heading", "What {loan} actually does for you."),
      f("short.included", "Heading above the features", "What's included"),
      f("short.clients", "Small line above the features (loans shown in brief)", "Why Clients Choose This"),
    ],
  },
  {
    id: "qualify",
    label: "Do you qualify, and the documents",
    hint: "The two boxes on the left of a loan page.",
    fields: [
      f("qualify.title", "Heading", "Do you qualify?"),
      f("qualify.which", "Small line above the kinds of applicant", "Which One Are You"),
      f("docs.title", "Heading of the documents box", "Documents Required"),
    ],
  },
  {
    id: "why",
    label: "Why Growth Capital Services",
    hint: "The blue block below the main card. A loan with its own words for it keeps them (see Loan product pages).",
    fields: [
      f("why.eyebrow", "Small line", "Why Growth Capital Services"),
      f("why.title", "Heading", "One conversation, many lenders to compare."),
      f(
        "why.body",
        "Text (when the loan has none of its own)",
        "We are a loan consultant, not the lender. We help you compare options from 75+ Banks and NBFCs, prepare your documents, and follow your application through each step.",
        true,
      ),
      f("why.primary", "Main button", "Check Your Eligibility"),
      f("why.secondary", "WhatsApp button", "Talk to Our Loan Expert"),
      f("why.noteLabel", "Bold start of the important note", "Important note:"),
      f(
        "why.note",
        "Important note (when the loan has none of its own)",
        "Interest rate, loan amount, tenure, charges, eligibility, approval and disbursement depend on the policy of the respective Bank or NBFC, your profile, credit assessment and the applicable terms. Growth Capital Services is a loan consultant and does not lend money itself. The details on this page are for general information.",
        true,
      ),
    ],
  },
  {
    id: "calc",
    label: "Calculators",
    hint: "The heading above the calculators that suit the loan.",
    fields: [
      f("calc.eyebrow", "Small line", "Run the numbers"),
      f("calc.title", "Heading", "Calculators for your {loan}"),
      f("calc.body", "Text", "Try your own figures before you apply — nothing is saved or sent.", true),
    ],
  },
  {
    id: "process",
    label: "Process",
    hint: "The heading above the steps. The loan's own steps are built into the page.",
    fields: [
      f("process.eyebrow", "Small line (all loans)", "Our Process"),
      f("process.title", "Heading (all loans)", "From first conversation to disbursal."),
      f("guide.eyebrow", "Small line (loans with their own guide)", "Step-by-step guide"),
      f("guide.title", "Heading (loans with their own guide)", "{loan} process, step by step."),
      f(
        "guide.note",
        "Note under the steps",
        "With GCS, your expert looks at your profile, matches it with suitable lenders, and coordinates with the banks for you. That means less confusion and more confidence when you apply.",
        true,
      ),
    ],
  },
  {
    id: "related",
    label: "Related loans",
    hint: "The list of other loans in the same category.",
    fields: [
      f("related.eyebrow", "Small line", "Worth Comparing"),
      f("related.title", "Heading", "The rest of {group}"),
      f(
        "related.body",
        "Text",
        "So you can weigh {loan} against everything else we arrange in this category before deciding.",
        true,
      ),
      f("related.all", "Link", "View all services"),
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. {phone} and {hours} come from Contact & CIBIL.",
    fields: [
      f("cta.title", "Heading", "Still deciding on {loan}?"),
      f("cta.gold", "End of the heading (gold)", "Ask us directly."),
      f("cta.call", "Line under the heading", "Call {phone} · {hours}"),
      f("cta.primary", "Main button", "Request a Call Back"),
      f("cta.secondary", "WhatsApp button", "WhatsApp Us"),
    ],
  },
];
export const LOANPAGE_TEXT = toMap(LOANPAGE_TEXT_SECTIONS);

export const CASEPAGE_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "top",
    label: "Top of a case study",
    hint: "The words around the case's own headline, amount and story, which are under Case studies.",
    fields: [
      f("top.sanctioned", "Label above the amount", "Sanctioned"),
      f("top.profile", "Label above the client profile", "Client Profile"),
    ],
  },
  {
    id: "stages",
    label: "The three stages",
    hint: "The three buttons that reveal the story, and the line above each.",
    fields: [
      f("stage.challenge.label", "First stage: button", "The Challenge"),
      f("stage.challenge.eyebrow", "First stage: small line", "What stood in the way"),
      f("stage.structuring.label", "Second stage: button", "The Structuring"),
      f("stage.structuring.eyebrow", "Second stage: small line", "How we routed it"),
      f("stage.outcome.label", "Third stage: button", "The Outcome"),
      f("stage.outcome.eyebrow", "Third stage: small line", "Where it landed"),
      f("stepper.back", "Back link", "← Back"),
      f("stepper.next", "Next link", "Next →"),
    ],
  },
  {
    id: "card",
    label: "Card beside the story",
    hint: "The box with the buttons. {title} is the loan's name.",
    fields: [
      f("card.eyebrow", "Small line", "Have a Similar Profile?"),
      f(
        "card.body",
        "Text",
        "A senior expert will review your situation and tell you which lenders in our network are the best fit — free of cost.",
        true,
      ),
      f("card.details", "First button", "{title} Details"),
      f("card.eligibility", "Second button", "Check Your Eligibility"),
      f("card.whatsapp", "WhatsApp button", "Chat on WhatsApp"),
    ],
  },
  {
    id: "similar",
    label: "Similar cases",
    hint: "The row of other cases at the foot.",
    fields: [
      f("similar.title", "Small line", "Similar Case Studies"),
      f("similar.read", "Link on each", "Read the case"),
    ],
  },
];
export const CASEPAGE_TEXT = toMap(CASEPAGE_TEXT_SECTIONS);

export const SERVICEPAGE_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "dossier",
    label: "Headings on a service page",
    hint: "The small lines above each block of a CA or legal service. The service's own text is under CA & legal services. {title} is the service's name.",
    fields: [
      f("who.eyebrow", "Who needs it (services shown in brief)", "Who Needs This"),
      f("how.eyebrow", "How it works", "How It Works"),
      f("docs.brief", "Documents (services shown in brief)", "Documents Typically Required"),
      f("docs.full", "Documents (services with a full checklist)", "Documents Required for {title}"),
      f("why.eyebrow", "Why us (services with a full checklist)", "Why Choose Our {title} Assistance?"),
      f("important.label", "Bold start of the important note", "Important:"),
    ],
  },
  {
    id: "side",
    label: "Beside the enquiry form",
    hint: "The words under the enquiry form and the list of similar services. {phone} and {category} are filled in.",
    fields: [
      f("side.call", "Line under the form", "Prefer to talk it through? Call {phone} or"),
      f("side.whatsapp", "WhatsApp link", "WhatsApp us"),
      f("similar.eyebrow", "Small line above similar services", "More in {category}"),
    ],
  },
];
export const SERVICEPAGE_TEXT = toMap(SERVICEPAGE_TEXT_SECTIONS);

export const SITE_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "footer",
    label: "Footer",
    hint: "The words in the footer on every page. The links in it are under Blocks, the address, phone and email under Phone, email & address. {year} becomes the current year.",
    fields: [
      f(
        "footer.blurb",
        "Text under the logo",
        "Established in 2017. Tailored loan solutions from leading Banks and NBFCs across Mumbai, Thane, Navi Mumbai and Pune. Your Growth, Our Financial Expertise.",
        true,
      ),
      f("footer.explore", "Heading of the first list", "Explore"),
      f("footer.products", "Heading of the loan list", "Loan Products"),
      f("footer.reach", "Heading of the contact column", "Reach Us"),
      f("footer.callback", "Button", "Request a Callback"),
      f("footer.copyright", "Copyright line", "© {year} Growth Capital Services. All rights reserved."),
    ],
  },
  {
    id: "header",
    label: "Header",
    hint: "The button at the top right of every page.",
    fields: [f("header.contact", "Button", "Contact Us")],
  },
];
export const SITE_TEXT = toMap(SITE_TEXT_SECTIONS);
