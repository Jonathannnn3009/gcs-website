// FAQ copy for the Contact and Partner pages. Staff can replace it from the CRM (Settings -> Website content).

export type Faq = { q: string; a: string };

export const CONTACT_FAQS: Faq[] = [
  {
    q: "How long until I hear back?",
    a: "A senior advisor typically calls back within one business day, with an indicative offer following shortly after.",
  },
  {
    q: "Are there any upfront charges?",
    a: "No advisory fee for customers — we're paid by the lender only on successful disbursal.",
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
    a: "No. As a referral partner, you introduce us to the client — our licensed advisors handle eligibility, documentation and lender matching.",
  },
  {
    q: "Is there a limit on how many clients I can refer?",
    a: "None. There's no cap on referrals or earnings — refer as many clients as you like.",
  },
];
