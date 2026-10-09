import { CONTACT } from "@/data/site";
import type { CustomPage } from "@/lib/site-content";

/**
 * DRAFT legal pages. They are offered in the CRM (Settings -> Website content -> New pages &
 * articles) as unpublished drafts, never shown on the site until staff tick Published. They are
 * general wording for a loan-advisory business and must be reviewed by a lawyer before use.
 */
const company = "Growth Capital Services";
const contact = `${CONTACT.address}. Email: ${CONTACT.email}. Phone: ${CONTACT.phone}.`;

export const LEGAL_DRAFTS: CustomPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    kind: "page",
    published: false,
    showInFooter: true,
    summary: `How ${company} collects, uses and protects your personal information.`,
    body: `## Who we are

${company} ("we", "us") is a loan advisory and facilitation firm. This policy explains what personal information we collect through this website, why, and the choices you have.

## What we collect

- Details you give us in forms: name, mobile number, email, city, the loan you need and the amount.
- Details you share while we work on your enquiry, such as income, employment and property information, and identity and address documents.
- Basic technical data when you visit: pages viewed, device and browser type, and the page you came from, collected through cookies and analytics tools.

## How we use it

- To contact you about your enquiry and assess which lenders may suit your profile.
- To prepare and submit your loan application to banks and NBFCs you ask us to approach.
- To send you updates about your file, and, where you agree, information about our services.
- To keep our records, meet legal obligations and improve this website.

## Who we share it with

We share your details with the banks, NBFCs and service providers (for example valuers, legal and technical agencies, and credit bureaus) needed to process your request, and only for that purpose. We do not sell your personal information.

## Credit reports

If you ask us to fetch a credit report, we do so only with your consent and use it only to advise you on your request.

## How long we keep it

We keep your information for as long as needed to serve you and to meet legal and record-keeping requirements, and then delete or anonymise it.

## Security

We use reasonable technical and organisational safeguards to protect your information. No system is completely secure, so please share sensitive documents only through the channels we give you.

## Your choices

You may ask to see, correct or delete the personal information we hold about you, or withdraw your consent to marketing, by contacting us below. We will respond within a reasonable time.

## Cookies

We use cookies and similar tools to make the site work and to understand how it is used. You can control cookies in your browser settings.

## Contact

${contact}`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    kind: "page",
    published: false,
    showInFooter: true,
    summary: `The terms for using the ${company} website and our advisory services.`,
    body: `## About these terms

By using this website or contacting ${company} you agree to these terms. If you do not agree, please do not use the site.

## What we do

We are a loan advisory and facilitation firm. We help you compare options across banks and NBFCs and support you through documentation and processing. We are not a bank or lender, and we do not sanction or disburse loans ourselves.

## No guarantee of approval

Whether a loan is approved, and its amount, rate and terms, is decided by the lender alone. Information on this site, including interest rates, calculators and eligibility tools, is indicative and is not an offer or commitment.

## Our fees

We do not charge customers an advisory fee for arranging a loan unless we tell you otherwise in writing before you proceed. We are paid by the lender on successful disbursal. Lenders may charge their own processing and other fees, which will be stated in their sanction documents.

## Your responsibilities

- Give us accurate and complete information and documents.
- Tell us promptly if anything changes.
- Do not misuse the site or attempt to disrupt it.

## Third-party content and links

Links to other websites are for convenience. We are not responsible for their content or practices.

## Limitation of liability

To the extent permitted by law, we are not liable for any indirect or consequential loss arising from use of this site or from a lender's decision.

## Changes

We may update these terms from time to time. The version on this page applies from the date it is published.

## Governing law

These terms are governed by the laws of India, and the courts at Mumbai have jurisdiction.

## Contact

${contact}`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    kind: "page",
    published: false,
    showInFooter: true,
    summary: `Important information about the content on the ${company} website.`,
    body: `## General

The information on this website is for general guidance only. It is not financial, legal, tax or investment advice, and you should consider your own circumstances before acting on it.

## We are not a lender

${company} is not a bank, NBFC or lender. We facilitate loan applications with banks and NBFCs. All loans are subject to the lender's own eligibility criteria, credit assessment, documentation and approval.

## Rates, fees and calculators

Interest rates, processing fees, eligibility estimates and calculator results shown here are indicative and may change without notice. The final terms are those in the lender's sanction letter.

## Names and logos

Bank and lender names and logos appear only to indicate the institutions we work with. They remain the property of their owners, and their appearance does not imply endorsement.

## Accuracy

We try to keep the information current and accurate but do not guarantee that it is complete or error-free.

## Contact

${contact}`,
  },
];
