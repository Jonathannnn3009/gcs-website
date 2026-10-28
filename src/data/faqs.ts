// FAQ copy for the Contact and Partner pages. Staff can replace it from the CRM (Settings -> Website content).

export type Faq = { q: string; a: string };

export const CONTACT_FAQS: Faq[] = [
  {
    q: "How long until I hear back?",
    a: "A senior expert typically calls back within one business day, with an indicative offer following shortly after.",
  },
  {
    q: "Are there any upfront charges?",
    a: "No advisory fee on most loans. For cash-flow and trade facilities and the two micro loans there is a service fee for managing your file, shown on that loan's page. In every case we tell you the amount in writing before you go ahead, so there are no surprises.",
  },
  {
    q: "Can you help if my application was rejected elsewhere?",
    a: "Often, yes. We review why it was declined and place the file with a lender better suited to the profile.",
  },
  {
    q: "Do you offer in-person consultations?",
    a: "Yes, by appointment at our Ghatkopar West office, Monday to Saturday.",
  },
];

export const PARTNER_FAQS: Faq[] = [
  {
    q: "Who can become a referral partner?",
    a: "Anyone with a network — Chartered Accountants, property consultants, brokers, insurance advisors, business consultants, or simply someone whose contacts occasionally need a loan.",
  },
  {
    q: "Is there a joining fee?",
    a: "No. There's no cost to register or refer — you only earn, you never pay.",
  },
  {
    q: "How and when do I get paid?",
    a: "Your referral fee is calculated once the loan is disbursed and settled directly to your account — no invoicing required from you.",
  },
  {
    q: "Do I need a license or certification to refer clients?",
    a: "No. As a referral partner, you introduce us to the client — our licensed experts handle eligibility, documentation and lender matching.",
  },
  {
    q: "Is there a limit on how many clients I can refer?",
    a: "None. There's no cap on referrals or earnings — refer as many clients as you like.",
  },
  {
    q: "What loans can I offer my clients?",
    a: "Home loans, loan against property, balance transfers, business and working-capital loans, personal, education and vehicle loans, and more. You refer the need and our experts pick the right product and lender.",
  },
  {
    q: "What support do I get as a partner?",
    a: "A named expert who handles login, documents and bank follow-ups, a short walk-through of our products when you start, and updates on each referral as it moves towards disbursal.",
  },
  {
    q: "How do I send a client's details and follow the case?",
    a: "Share the client's name, number and requirement through the form on this page, or by call or WhatsApp. Your expert keeps you updated on the status, approval and disbursal of every referral.",
  },
];
