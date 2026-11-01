// The wording on three more pages that is not part of a repeated block: CA & Legal, Partner and
// Track Application. Staff change it in the CRM (Settings -> the page's tab); wherever they have not,
// the text here is used. Where a line has a gold part in the page, it is its own field.

import type { HomeTextSection } from "@/data/home-text";

const toMap = (sections: HomeTextSection[]): Record<string, string> =>
  Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f.text])));

/** The three steps in the CA & Legal enquiry block. */
export const CALEGAL_STEPS = [
  {
    title: "Tell us what you need",
    body: "A few words are enough. A tax filing, a GST question or a property document.",
  },
  {
    title: "We connect you",
    body: "Our team matches you with the right CA or legal professional.",
  },
  {
    title: "You get clear next steps",
    body: "You are told what documents are needed and how the work will go.",
  },
];

export const CALEGAL_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Beyond Your Loan" },
      { id: "hero.title", label: "Heading", text: "Tax, Compliance &" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "Legal Documentation, Sorted." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Alongside our loan business, we connect you with our associated professionals — our CA Services team for tax, GST and business compliance, and our Professional Legal Services team for property and legal documentation — each handling the work through their own professional process, with GCS as your single point of contact.",
        long: true,
      },
    ],
  },
  {
    id: "divisions",
    label: "The two practices",
    hint: "The heading of each block. {count} becomes the number of services in it. The services themselves are under CA & legal services.",
    fields: [
      { id: "ca.title", label: "CA Services: heading", text: "Tax, GST, accounting and business registration." },
      { id: "legal.title", label: "Legal Services: heading", text: "Property, society and legal documentation." },
      { id: "divisions.included", label: "Line above the list of services", text: "What's included · {count} services" },
    ],
  },
  {
    id: "cta",
    label: "Enquiry block",
    hint: "The text beside the enquiry form. The three steps are under Blocks. {phone} comes from Contact & CIBIL.",
    fields: [
      { id: "cta.eyebrow", label: "Small line", text: "Not Sure Where to Start?" },
      { id: "cta.title", label: "Heading", text: "Tell us what you need —" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "we'll point you right." },
      {
        id: "cta.body",
        label: "Paragraph",
        text: "Whether it's a tax filing, a GST question or a property document, share your requirement and our team will connect you with the right associated professional.",
        long: true,
      },
      { id: "cta.call", label: "Call button", text: "Call {phone}" },
      { id: "cta.whatsapp", label: "WhatsApp button", text: "WhatsApp Us" },
    ],
  },
];
export const CALEGAL_TEXT = toMap(CALEGAL_TEXT_SECTIONS);

export const PARTNER_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel beside the registration form. The figures and tick points are under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Agent Partner" },
      { id: "hero.title", label: "Heading", text: "Turn your network into" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "a second income." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "If you're a CA, broker, advisor or consultant whose clients occasionally need a loan, refer them to us. We handle the lending end to end — you stay the trusted contact, and earn on every case we disburse.",
        long: true,
      },
      {
        id: "hero.quote",
        label: "Quote at the foot of the panel",
        text: "\"You bring the introduction. We bring 75+ lenders, a senior expert, and the paperwork.\"",
        long: true,
      },
    ],
  },
  {
    id: "what",
    label: "What we do",
    hint: "The heading above the first set of cards.",
    fields: [
      { id: "what.eyebrow", label: "Small line", text: "What We Do" },
      { id: "what.title", label: "Heading", text: "Simple process. Clear payouts. Real earnings." },
      {
        id: "what.body",
        label: "Text",
        text: "We bring banks, NBFCs and independent advisors onto one desk, so families and business owners can find the right loan without going from bank to bank. You make the introduction and we do the rest.",
        long: true,
      },
    ],
  },
  {
    id: "builtfor",
    label: "Who it is for",
    hint: "The heading above the kinds of partner. The cards are under Blocks.",
    fields: [
      { id: "builtfor.eyebrow", label: "Small line", text: "Built For" },
      {
        id: "builtfor.title",
        label: "Heading",
        text: "If your clients ask you finance questions, this is for you.",
      },
      {
        id: "builtfor.body",
        label: "Text",
        text: "A second income stream that doesn't cost you anything but a referral.",
        long: true,
      },
    ],
  },
  {
    id: "how",
    label: "How it works",
    hint: "The heading and paragraph beside the picture. The four steps are under Blocks.",
    fields: [
      { id: "how.eyebrow", label: "Small line", text: "How It Works" },
      { id: "how.title", label: "Heading", text: "From introduction to payout — four steps." },
      {
        id: "how.body",
        label: "Text",
        text: "You make the introduction. Everything after that is on us.",
        long: true,
      },
      {
        id: "how.paragraph",
        label: "Paragraph",
        text: "Most referral programs leave you chasing updates or managing paperwork you never signed up for. Ours doesn't. Once you share a lead, a dedicated expert takes ownership of the file end to end — checking eligibility, matching it against our network of 75+ banks and NBFCs, and pushing it through to disbursal — while you get scheduled updates at every stage instead of radio silence until the payout.",
        long: true,
      },
    ],
  },
  {
    id: "why",
    label: "Why partner with us",
    hint: "The heading above the benefit cards. The cards are under Blocks.",
    fields: [
      { id: "why.eyebrow", label: "Small line", text: "Why Partner With GCS" },
      { id: "why.title", label: "Heading", text: "What you get." },
      {
        id: "why.body",
        label: "Text",
        text: "No fine print — just the reasons professionals already refer to us.",
        long: true,
      },
    ],
  },
  {
    id: "choose",
    label: "Why choose us",
    hint: "The heading above the second set of cards.",
    fields: [
      { id: "choose.eyebrow", label: "Small line", text: "Why Choose Us" },
      { id: "choose.title", label: "Heading", text: "A loan partner that is on your side." },
      {
        id: "choose.body",
        label: "Text",
        text: "We want partners to be able to serve their clients better and grow their earnings, with nothing hidden.",
        long: true,
      },
    ],
  },
  {
    id: "earn",
    label: "What you earn",
    hint: "The commission table's heading and its note. The rows come from the commission rate cards.",
    fields: [
      { id: "earn.eyebrow", label: "Small line", text: "What You Earn" },
      { id: "earn.title", label: "Heading", text: "Referral commission by loan type." },
      {
        id: "earn.body",
        label: "Text",
        text: "Indicative earning per successful referral — actual payout depends on the lender, loan amount and your partner tier.",
        long: true,
      },
      {
        id: "earn.note",
        label: "Note under the table",
        text: "Commission rates may vary based on lender, loan amount and partner tier.",
      },
    ],
  },
  {
    id: "estimate",
    label: "Earnings estimator",
    hint: "The heading above the estimator.",
    fields: [
      { id: "estimate.eyebrow", label: "Small line", text: "What You Could Earn" },
      { id: "estimate.title", label: "Heading", text: "Work out your own numbers." },
      {
        id: "estimate.body",
        label: "Text",
        text: "Pick a loan type, a typical amount and how many clients you might refer in a month.",
        long: true,
      },
    ],
  },
  {
    id: "assistant",
    label: "AI assistant",
    hint: "The block about the assistant. {name} is the assistant's name.",
    fields: [
      { id: "assistant.eyebrow", label: "Small line", text: "Meet {name}" },
      {
        id: "assistant.title",
        label: "Heading",
        text: "An AI assistant that answers your clients' first questions.",
      },
      {
        id: "assistant.body",
        label: "Text",
        text: "Send clients to our site and let the assistant handle the basics: eligibility, EMI, documents and rates, any time of day. When they are ready to talk, it passes them to an expert.",
        long: true,
      },
    ],
  },
  {
    id: "start",
    label: "Get started",
    hint: "The block with the three steps to register.",
    fields: [
      { id: "start.title", label: "Heading", text: "Ready to turn your network into a second income?" },
      { id: "start.body", label: "Text", text: "Three steps, and the first one takes two minutes." },
      { id: "start.button", label: "Button", text: "Register as a Partner" },
    ],
  },
  {
    id: "reasons",
    label: "Reasons to partner",
    hint: "The heading beside the picture. The expandable reasons are under Blocks.",
    fields: [
      { id: "reasons.eyebrow", label: "Small line", text: "Worth Knowing" },
      { id: "reasons.title", label: "Heading", text: "Reasons to partner with us." },
      {
        id: "reasons.body",
        label: "Text",
        text: "Beyond the referral fee, most professionals who stick with this partnership for years mention the same handful of reasons. Expand each one below.",
        long: true,
      },
    ],
  },
  {
    id: "faq",
    label: "Questions",
    hint: "The heading above the questions. The questions are under FAQs.",
    fields: [
      { id: "faq.eyebrow", label: "Small line", text: "Before You Register" },
      { id: "faq.title", label: "Heading", text: "Quick answers." },
      {
        id: "faq.body",
        label: "Text",
        text: "The questions that come up most before someone sends their first referral.",
        long: true,
      },
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom. The phone and hours under it come from Contact & CIBIL.",
    fields: [
      { id: "cta.title", label: "Heading", text: "Prefer to talk it through first?" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "Call us." },
      { id: "cta.call", label: "Call button", text: "Call Us" },
      { id: "cta.whatsapp", label: "WhatsApp button", text: "WhatsApp Us" },
    ],
  },
];
export const PARTNER_TEXT = toMap(PARTNER_TEXT_SECTIONS);

export const TRACK_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph, and the two choices under them.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Track Application" },
      { id: "hero.title", label: "Heading", text: "Where does your loan file stand?" },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Follow your application from login to sanction and disbursal. Choose who you are, enter your GCS ID, and we will take you to your tracking page.",
        long: true,
      },
      { id: "who.client", label: "First choice: name", text: "Client" },
      { id: "who.clientBlurb", label: "First choice: line", text: "I have a GCS ID for my loan file" },
      { id: "who.partner", label: "Second choice: name", text: "Partner" },
      { id: "who.partnerBlurb", label: "Second choice: line", text: "I refer clients to GCS" },
    ],
  },
  {
    id: "client",
    label: "Panel for clients",
    hint: "The dark panel shown when Client is chosen.",
    fields: [
      { id: "client.eyebrow", label: "Small line", text: "For clients" },
      { id: "client.title", label: "Heading", text: "Track your loan file" },
      {
        id: "client.text",
        label: "Paragraph",
        text: "Enter your mobile number and GCS ID. We will take you to your tracking page, where you can see where your application stands.",
        long: true,
      },
      { id: "client.p1", label: "Point 1", text: "The current status of your application" },
      { id: "client.p2", label: "Point 2", text: "Your file followed from login to sanction and disbursal" },
      {
        id: "client.p3",
        label: "Point 3",
        text: "Your GCS ID is the code your expert shared when your application was opened",
      },
      {
        id: "client.p4",
        label: "Point 4",
        text: "No GCS ID yet? Confirm your mobile number and we text it to you",
      },
      { id: "client.noId", label: "Link under the form", text: "Do not have a GCS ID?" },
      { id: "client.help", label: "Start of the help line", text: "Need help finding your GCS ID?" },
    ],
  },
  {
    id: "partner",
    label: "Panel for partners",
    hint: "The dark panel shown when Partner is chosen.",
    fields: [
      { id: "partner.eyebrow", label: "Small line", text: "For partners" },
      { id: "partner.title", label: "Heading", text: "Partner sign in" },
      {
        id: "partner.text",
        label: "Paragraph",
        text: "Enter your registered mobile number and your Partner ID, and we will take you to your partner portal. There you sign in with your password.",
        long: true,
      },
      { id: "partner.p1", label: "Point 1", text: "Every client you have referred, in one place" },
      { id: "partner.p2", label: "Point 2", text: "Where each file stands, from referral to disbursal" },
      { id: "partner.p3", label: "Point 3", text: "Your commission structure" },
      {
        id: "partner.p4",
        label: "Point 4",
        text: "Lost your Partner ID? Confirm your mobile number and we text it to you",
      },
      { id: "partner.noId", label: "Link under the form", text: "Do not have a Partner ID?" },
      {
        id: "partner.help",
        label: "Start of the help line",
        text: "Forgot your password, or not a partner yet?",
      },
    ],
  },
];
export const TRACK_TEXT = toMap(TRACK_TEXT_SECTIONS);
