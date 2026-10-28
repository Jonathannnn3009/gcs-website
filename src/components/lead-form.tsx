import { useId, useState, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";
import { APPLICANT_CATEGORY_LABELS, PRODUCTS, SERVICE_FEE_SLUGS } from "@/data/products";
import { submitLead, submitLeadForFollowUp, type FollowUpPass } from "@/lib/leads";
import { followUpFor } from "@/data/follow-up-forms";
import { FollowUpFlow } from "@/components/follow-up-flow";
import { INDUSTRIES } from "@/data/industries";
import { amountProblem, isValidEmail, loanAmountBounds } from "@/lib/validation";
import { Toast } from "@/components/toast";
import { FORM_LOAN_TYPES } from "@/data/page-lists";
import { useApplicantOptions, useCities, useList } from "@/lib/page-lists";

// Paperwork genuinely differs by applicant type for these two — ask early.
// Dropdown choices that are the same loan as a product page under another name.
const SLUG_ALIASES: Record<string, string> = { "overdraft-facility": "overdraft-limit" };

// Loans whose short form asks "You Are". The overdrafts are taken by salaried people as well as business owners.
const PERSON_ONLY_CATEGORIES = ["Salaried", "Self-Employed"];
const CATEGORY_LOANS = new Set(["home-loan"]);
// Property loans: the kind of loan, the kind of property and who is applying, each from the lists for that loan.
const LAP_SLUG = "loan-against-property";
type PropertyLoan = {
  kinds: string[];
  properties: string[];
  applicants: string[];
  propertyLabel?: string;
  /** How the detail line names the property question (default "Property"). */
  propertyWord?: string;
  /** Education only: where the student will study, and who the co-applicant is. */
  study?: string[];
  coApplicants?: string[];
};
const PROPERTY_LOANS: Record<string, PropertyLoan> = {
  [LAP_SLUG]: {
    kinds: [
      "Loan Against Property (LAP)",
      "LAP Balance Transfer",
      "LAP Balance Transfer + Top-Up",
      "LAP Top-Up Loan",
      "Commercial Purchase Loan",
      "LAP Overdraft",
      "Lease Rental Discounting",
    ],
    properties: [
      "Residential Property",
      "Commercial Property",
      "Industrial Property",
      "Specialised Property",
    ],
    applicants: ["Salaried", "Self-Employed", "Partnership", "Pvt Ltd Co", "LLP", "Proprietorship"],
  },
  "micro-lap": {
    kinds: [
      "Micro LAP",
      "Micro LAP Top-Up",
      "Micro LAP Balance Transfer",
      "Micro LAP Top-Up + Balance Transfer",
    ],
    properties: ["Self-occupied residential property", "Commercial property", "Mixed-use property"],
    applicants: ["Salaried", "Self-Employed", "Proprietor", "Partner / Director"],
  },
  dlod: {
    kinds: [
      "Drop-Line Overdraft (DOD)",
      "Drop-Line Overdraft Balance Transfer",
      "Drop-Line Overdraft Top-Up",
    ],
    properties: ["Residential Property", "Commercial Property", "Industrial Property"],
    applicants: [
      "Self-employed professional",
      "Proprietorship",
      "Partnership / LLP",
      "Pvt Ltd Co",
      "Salaried",
    ],
  },
  "project-funding": {
    propertyLabel: "Type of Project",
    kinds: [
      "Land Purchase Loan",
      "Construction Finance",
      "Project Term Loan",
      "Inventory Funding",
      "Lease Rental Discounting",
      "Structured / Mezzanine Funding",
    ],
    properties: [
      "Residential project or township",
      "Commercial project, mall or office",
      "Infrastructure",
      "Industrial or manufacturing unit",
    ],
    applicants: [
      "Builder / Developer",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Trust / Society",
    ],
  },
  "business-loan": {
    kinds: [
      "Unsecured Business Loan",
      "Secured Business Loan",
      "Business Term Loan",
      "Working Capital Loan",
      "Business Loan Balance Transfer",
      "Business Loan Top-Up",
    ],
    properties: [],
    applicants: [
      "Proprietorship",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Self-employed professional",
    ],
  },
  "micro-business-loan": {
    kinds: [
      "Micro Business Loan",
      "Micro Business Loan Balance Transfer",
      "Micro Business Loan Top-Up",
      "Micro Business Loan Top-Up + Balance Transfer",
    ],
    properties: [],
    applicants: [
      "Self-employed individual",
      "Sole proprietorship",
      "Partnership firm",
      "LLP",
      "Private limited company",
    ],
  },
  "unsecured-dod": {
    kinds: [
      "Unsecured Drop-Line Overdraft",
      "Unsecured Overdraft",
      "Unsecured Overdraft Balance Transfer",
      "Unsecured Overdraft Top-Up",
      "Unsecured Overdraft Balance Transfer + Top-Up",
    ],
    properties: [],
    applicants: [
      "Salaried",
      "Self-employed professional",
      "Proprietorship",
      "Partnership / LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
    ],
  },
  "professional-loan": {
    kinds: [
      "Professional Loan",
      "Doctor Loan",
      "CA / CS Loan",
      "Architect and Engineer Loan",
      "Practice Setup Loan",
      "Equipment Purchase Loan",
      "Professional Overdraft",
    ],
    properties: [],
    applicants: [],
  },
  "private-funding": {
    kinds: [
      "Private Business Funding",
      "Short-Term Working Capital Funding",
      "Business Opportunity Funding",
      "Obligation Funding",
      "Top-Up for Repeat Customers",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  cgtmse: {
    kinds: [
      "CGTMSE Term Loan",
      "CGTMSE Working Capital",
      "CGTMSE Composite Loan",
      "CGTMSE for Services",
      "CGTMSE for Trading",
      "Non-Fund Based Facilities",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "machine-loan": {
    kinds: [
      "New Machinery Loan",
      "Used Machinery Loan",
      "Medical Equipment Loan",
      "Genset Loan",
      "Equipment Leasing",
      "Loan Against Machinery",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "working-capital-term-loan": {
    kinds: [
      "Working Capital Term Loan",
      "Cash Credit / Overdraft Regularisation",
      "Debt Consolidation Loan",
      "Seasonal Working Capital",
      "Working Capital Top-Up",
    ],
    properties: [],
    applicants: [
      "Proprietorship",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Self-employed professional",
    ],
  },
  "cash-credit": {
    kinds: [
      "Cash Credit against Stock and Debtors",
      "Cash Credit against Receivables",
      "Secured Cash Credit",
      "Cash Credit Limit Enhancement",
      "Cash Credit Takeover",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "overdraft-limit": {
    kinds: [
      "Overdraft against Property",
      "Overdraft against Fixed Deposits",
      "Overdraft against Securities",
      "Unsecured Overdraft",
      "Drop-Line Overdraft",
      "Overdraft Balance Transfer",
    ],
    properties: [],
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership / LLP", "Pvt Ltd Co"],
  },
  "bank-guarantee": {
    kinds: [
      "Performance Guarantee",
      "Financial Guarantee",
      "Bid Bond / Tender Guarantee (EMD)",
      "Advance Payment Guarantee",
      "Retention Money Guarantee",
      "Shipping Guarantee",
      "Customs and Excise Guarantee",
      "Warranty Guarantee",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "letter-of-credit": {
    kinds: [
      "Inland Letter of Credit",
      "Import Letter of Credit",
      "Sight Letter of Credit",
      "Usance Letter of Credit",
      "Standby Letter of Credit",
      "Revolving Letter of Credit",
      "Back-to-Back Letter of Credit",
      "Red Clause / Green Clause Credit",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "bill-discounting": {
    kinds: [
      "Sales Bill Discounting",
      "Supplier Bill Discounting",
      "LC Bill Discounting",
      "Invoice Discounting",
      "Factoring",
      "Vendor / Dealer Finance",
      "TReDS Invoice Financing",
    ],
    properties: [],
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "personal-loan": {
    kinds: [
      "Personal Loan",
      "Wedding Loan",
      "Travel Loan",
      "Medical Loan",
      "Home Renovation Loan",
      "Debt Consolidation Loan",
      "Personal Loan Balance Transfer",
    ],
    properties: [],
    applicants: ["Salaried", "Self-employed professional", "Self-employed business owner"],
  },
  "education-loan": {
    kinds: [
      "Education Loan",
      "Secured Education Loan",
      "Unsecured Education Loan",
      "Diploma and Skill Course Loan",
      "Undergraduate, Postgraduate and Doctorate Loan",
    ],
    properties: [],
    applicants: ["Student", "Co-applicant: Salaried", "Co-applicant: Self-Employed"],
    study: ["In India", "Abroad"],
    coApplicants: ["Father", "Mother", "Spouse", "Guardian", "Other"],
  },
  "new-car-loan": {
    kinds: [
      "New Car Loan",
      "Electric Vehicle Loan",
      "Luxury Car Loan",
      "Car Loan for Business Use",
    ],
    properties: [],
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "used-car-loan": {
    kinds: [
      "Used Car Loan from a Dealer",
      "Used Car Loan from a Private Owner",
      "Used Car Loan Balance Transfer",
      "Used Car Loan Top-Up",
      "Used Car Loan Top-Up + Balance Transfer",
    ],
    properties: [],
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "car-refinance": {
    kinds: [
      "Loan Against Car",
      "Car Loan Balance Transfer",
      "Car Loan Top-Up",
      "Car Loan Balance Transfer + Top-Up",
    ],
    properties: [],
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "loan-against-securities": {
    kinds: [
      "Loan Against Shares",
      "Loan Against Mutual Funds",
      "Loan Against ETFs",
      "Loan Against Bonds and Government Securities",
    ],
    properties: [],
    applicants: [
      "Salaried",
      "Self-Employed",
      "Retired or an investor",
      "Promoter of a listed company",
    ],
  },
  "commercial-vehicle": {
    kinds: [
      "New Commercial Vehicle Loan",
      "Used Commercial Vehicle Loan",
      "Commercial Vehicle Balance Transfer",
      "Commercial Vehicle Top-Up",
    ],
    propertyLabel: "Type of Vehicle",
    propertyWord: "Vehicle",
    properties: [
      "Truck (medium and heavy)",
      "Light commercial vehicle / tempo",
      "Tipper",
      "Tanker",
      "Bus or passenger vehicle",
      "Transit mixer",
      "Trailer or tractor-trailer",
    ],
    applicants: ["Individual transporter", "Proprietorship", "Partnership", "Company"],
  },
  "lease-rental-discounting": {
    kinds: ["Lease Rental Discounting (LRD)", "LRD Balance Transfer", "LRD Top-Up"],
    properties: [
      "Office",
      "Shop / retail space",
      "Mall or multi-tenant building",
      "Warehouse",
      "Educational institute",
      "Hotel or service apartments",
    ],
    applicants: ["Individual owner", "Company / Firm", "Partnership", "LLP"],
  },
};
// The second form only tells salaried, self-employed and NRI apart: a firm or company counts as self-employed there.
// The lease rental form asks who owns the property instead, so it takes no applicant type.
const forSecondForm = (category: string, slug: string) =>
  [
    "lease-rental-discounting",
    "project-funding",
    "business-loan",
    "micro-business-loan",
    "private-funding",
    "cgtmse",
    "machine-loan",
    "working-capital-term-loan",
    "cash-credit",
    "bank-guarantee",
    "letter-of-credit",
    "bill-discounting",
    "education-loan",
    "commercial-vehicle",
  ].includes(slug)
    ? ""
    : [
          "Partnership",
          "Pvt Ltd Co",
          "LLP",
          "Proprietorship",
          "Proprietor",
          "Partner / Director",
          "Self-employed professional",
          "Partnership / LLP",
          "Public Ltd Co",
          "Self-employed business owner",
          "Promoter of a listed company",
        ].includes(category)
      ? "Self-Employed"
      : category;
// What the short form's answers already say in the second form.
const SECOND_FORM_PROPERTY: Record<string, string> = {
  "Residential Property": "Residential (flat / house)",
  "Commercial Property": "Commercial (shop / office)",
  "Industrial Property": "Industrial (factory / warehouse)",
  "Self-occupied residential property": "Residential (flat / house)",
  "Commercial property": "Commercial (shop / office)",
  Office: "Office",
  "Shop / retail space": "Shop / retail space",
  "Mall or multi-tenant building": "Mall or multi-tenant building",
  Warehouse: "Warehouse",
  "Educational institute": "Other",
  "Hotel or service apartments": "Other",
};
const SECOND_FORM_OWNER: Record<string, string> = {
  "Individual owner": "An individual (or jointly with family)",
  "Company / Firm": "A company",
  Partnership: "A partnership firm or LLP",
  LLP: "A partnership firm or LLP",
};
// The drop-line overdraft form asks how the business is set up; the project form asks how the promoter is set up.
const SECOND_FORM_SETUP: Record<string, string> = {
  "Self-employed professional": "Professional (doctor, CA, architect, etc.)",
  Proprietorship: "Proprietorship",
  "Partnership / LLP": "Partnership or LLP",
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
};
const SECOND_FORM_PROMOTER: Record<string, string> = {
  Partnership: "Partnership or LLP",
  LLP: "Partnership or LLP",
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
  "Trust / Society": "Trust or society",
};
const SECOND_FORM_STAGE: Record<string, string> = {
  "Land Purchase Loan": "Still to buy the land",
  "Construction Finance": "Under construction",
  "Inventory Funding": "Built, with units left to sell or let",
  "Lease Rental Discounting": "Built, with units left to sell or let",
};
// The business loan forms ask how the business is set up, in the same words as "You Are".
const SECOND_FORM_BUSINESS: Record<string, string> = {
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
};
// The overdraft forms ask whether the limit is new or moved from another lender.
const overdraftRequirement = (loanKind: string): Record<string, string> =>
  /Balance Transfer \+ Top-Up/.test(loanKind)
    ? { requirement: "Move it and add more funding" }
    : /Balance Transfer/.test(loanKind)
      ? { requirement: "Move my present overdraft or loan" }
      : {};
const professionalPurpose = (loanKind: string): Record<string, string> =>
  loanKind === "Practice Setup Loan"
    ? { purpose: "Setting up or moving a practice" }
    : loanKind === "Equipment Purchase Loan"
      ? { purpose: "Buying equipment" }
      : {};
const privatePurpose = (loanKind: string): Record<string, string> =>
  loanKind === "Short-Term Working Capital Funding"
    ? { purpose: "Short-term cash flow" }
    : loanKind === "Business Opportunity Funding"
      ? { purpose: "A business opportunity" }
      : loanKind === "Obligation Funding"
        ? { purpose: "An existing business obligation" }
        : {};
const cgtmseKnown = (loanKind: string): Record<string, string> =>
  loanKind === "CGTMSE Term Loan"
    ? { structure: "A term loan" }
    : loanKind === "CGTMSE Working Capital"
      ? { structure: "A working capital limit" }
      : loanKind === "CGTMSE Composite Loan"
        ? { structure: "Both" }
        : loanKind === "CGTMSE for Services"
          ? { activity: "Services" }
          : loanKind === "CGTMSE for Trading"
            ? { activity: "Trading" }
            : {};
const machineKnown = (loanKind: string): Record<string, string> =>
  loanKind === "New Machinery Loan"
    ? { equipment: "Machinery for production", condition: "New" }
    : loanKind === "Used Machinery Loan"
      ? { equipment: "Machinery for production", condition: "Used" }
      : loanKind === "Medical Equipment Loan"
        ? { equipment: "Medical equipment" }
        : loanKind === "Genset Loan"
          ? { equipment: "A genset" }
          : loanKind === "Equipment Leasing"
            ? { equipment: "Equipment on lease" }
            : {};
const wctlKnown = (loanKind: string): Record<string, string> =>
  loanKind === "Cash Credit / Overdraft Regularisation"
    ? { gapCause: "To regularise a stretched cash credit or overdraft" }
    : loanKind === "Debt Consolidation Loan"
      ? { gapCause: "To consolidate several short-term dues" }
      : loanKind === "Seasonal Working Capital"
        ? { gapCause: "A seasonal build-up of stock" }
        : {};
const overdraftKnown = (loanKind: string): Record<string, string> =>
  loanKind === "Overdraft against Property"
    ? { securityKind: "Against a property" }
    : /Fixed Deposits|Securities/.test(loanKind)
      ? { securityKind: "Against fixed deposits or securities" }
      : loanKind === "Unsecured Overdraft"
        ? { securityKind: "Without security" }
        : {};
const BG_TYPES: Record<string, string> = {
  "Performance Guarantee": "Performance guarantee",
  "Financial Guarantee": "Financial guarantee",
  "Bid Bond / Tender Guarantee (EMD)": "Bid bond or EMD",
  "Advance Payment Guarantee": "Advance-payment guarantee",
};
const lcKnown = (loanKind: string): Record<string, string> => ({
  ...(loanKind === "Inland Letter of Credit" ? { lcType: "Inland (within India)" } : {}),
  ...(loanKind === "Import Letter of Credit" ? { lcType: "Import" } : {}),
  ...(loanKind === "Sight Letter of Credit"
    ? { usance: "At sight, when the documents arrive" }
    : {}),
});
const personalKnown = (loanKind: string): Record<string, string> =>
  ({
    "Wedding Loan": { purpose: "Wedding" },
    "Travel Loan": { purpose: "Travel" },
    "Medical Loan": { purpose: "Medical need" },
    "Home Renovation Loan": { purpose: "Home renovation" },
    "Debt Consolidation Loan": { purpose: "Repaying other loans" },
  })[loanKind] ?? {};
const educationKnown = (
  loanKind: string,
  study: string,
  coKind: string,
  applicant: string,
): Record<string, string> => ({
  ...(study ? { destination: study } : {}),
  ...(coKind ? { coRelation: coKind } : {}),
  ...(loanKind === "Diploma and Skill Course Loan" ? { level: "Diploma or certificate" } : {}),
  ...(applicant === "Co-applicant: Salaried" ? { coWork: "Salaried" } : {}),
  ...(applicant === "Co-applicant: Self-Employed" ? { coWork: "Runs a business" } : {}),
});
const carKnown = (slug: string, loanKind: string): Record<string, string> => ({
  ...(slug === "new-car-loan" && loanKind === "Car Loan for Business Use"
    ? { usage: "Business use" }
    : {}),
  ...(slug === "used-car-loan" && /Dealer/.test(loanKind) ? { seller: "A dealer" } : {}),
  ...(slug === "used-car-loan" && /Private Owner/.test(loanKind)
    ? { seller: "A private owner" }
    : {}),
  ...(slug === "car-refinance" && loanKind === "Loan Against Car" ? { carLoan: "No" } : {}),
  ...(slug === "car-refinance" && /Balance Transfer|Top-Up/.test(loanKind)
    ? { carLoan: "Yes" }
    : {}),
  ...(slug === "car-refinance" && /Balance Transfer/.test(loanKind)
    ? { carLoanTakeover: "Yes" }
    : {}),
});
const VEHICLE_TYPES: Record<string, string> = {
  "Truck (medium and heavy)": "Truck",
  "Light commercial vehicle / tempo": "Small commercial vehicle or tempo",
  Tipper: "Tipper",
  "Bus or passenger vehicle": "Bus or passenger vehicle",
  "Trailer or tractor-trailer": "Trailer or tractor-trailer",
};
const vehicleKnown = (
  loanKind: string,
  vehicle: string,
  applicant: string,
): Record<string, string> => ({
  ...(VEHICLE_TYPES[vehicle] ? { vehicleType: VEHICLE_TYPES[vehicle] } : {}),
  ...(loanKind.startsWith("New") ? { condition: "New" } : {}),
  ...(loanKind.startsWith("Used") ? { condition: "Used" } : {}),
  ...(applicant === "Individual transporter" ? { constitution: "An individual transporter" } : {}),
  ...(["Proprietorship", "Partnership", "Company"].includes(applicant)
    ? { constitution: applicant }
    : {}),
});
const SECURITIES_HOLDING: Record<string, string> = {
  "Loan Against Shares": "Shares",
  "Loan Against Mutual Funds": "Mutual funds",
  "Loan Against ETFs": "ETFs",
  "Loan Against Bonds and Government Securities": "Bonds",
};
const knownFromShortForm = (
  slug: string,
  loanKind: string,
  propertyKind: string,
  applicant: string,
  study = "",
  coKind = "",
): Record<string, string> =>
  slug === "personal-loan"
    ? personalKnown(loanKind)
    : slug === "education-loan"
      ? educationKnown(loanKind, study, coKind, applicant)
      : ["new-car-loan", "used-car-loan", "car-refinance"].includes(slug)
        ? carKnown(slug, loanKind)
        : slug === "commercial-vehicle"
          ? vehicleKnown(loanKind, propertyKind, applicant)
          : slug === "loan-against-securities"
            ? {
                ...(SECURITIES_HOLDING[loanKind] ? { holding: SECURITIES_HOLDING[loanKind] } : {}),
                ...(applicant === "Promoter of a listed company"
                  ? { holding: "A promoter's shares in a company" }
                  : {}),
              }
            : slug === "bill-discounting"
              ? {}
              : knownByLoan(slug, loanKind, propertyKind, applicant);
const knownByLoan = (
  slug: string,
  loanKind: string,
  propertyKind: string,
  applicant: string,
): Record<string, string> =>
  ["business-loan", "micro-business-loan", "private-funding", "cgtmse"].includes(slug)
    ? {
        constitution: SECOND_FORM_BUSINESS[applicant] ?? applicant,
        ...(loanKind === "Working Capital Loan" ? { purpose: "Working capital" } : {}),
        ...(slug === "private-funding" ? privatePurpose(loanKind) : {}),
        ...(slug === "cgtmse" ? cgtmseKnown(loanKind) : {}),
      }
    : slug === "machine-loan"
      ? machineKnown(loanKind)
      : slug === "project-funding"
        ? {
            projectType: propertyKind,
            ...(SECOND_FORM_STAGE[loanKind] ? { stage: SECOND_FORM_STAGE[loanKind] } : {}),
            ...(SECOND_FORM_PROMOTER[applicant]
              ? { constitution: SECOND_FORM_PROMOTER[applicant] }
              : {}),
          }
        : {
            ...(["unsecured-dod", "dlod", "overdraft-limit", "overdraft-facility"].includes(slug)
              ? overdraftRequirement(loanKind)
              : {}),
            ...(slug === "overdraft-limit" || slug === "overdraft-facility"
              ? overdraftKnown(loanKind)
              : {}),
            ...(slug === "working-capital-term-loan" ? wctlKnown(loanKind) : {}),
            ...(slug === "bank-guarantee" && BG_TYPES[loanKind]
              ? { bgType: BG_TYPES[loanKind] }
              : {}),
            ...(slug === "letter-of-credit" ? lcKnown(loanKind) : {}),
            ...(slug === "professional-loan" ? professionalPurpose(loanKind) : {}),
            ...(["dlod", "unsecured-dod", "overdraft-limit", "overdraft-facility"].includes(slug) &&
            SECOND_FORM_SETUP[applicant]
              ? { constitution: SECOND_FORM_SETUP[applicant] }
              : {}),
            ...(SECOND_FORM_PROPERTY[propertyKind]
              ? { propertyKind: SECOND_FORM_PROPERTY[propertyKind] }
              : {}),
            ...(propertyKind === "Self-occupied residential property"
              ? { propertyUse: "Self-occupied or self-used" }
              : {}),
            ...(slug === "lease-rental-discounting" && SECOND_FORM_OWNER[applicant]
              ? { ownerType: SECOND_FORM_OWNER[applicant] }
              : {}),
            ...(/Balance Transfer|Top-Up/.test(loanKind) ? { existingMortgage: "Yes" } : {}),
          };
const OVERDRAFT_CATEGORY_LOANS = new Set(["unsecured-dod", "dlod", "overdraft-limit"]);
// Loans whose short form asks for the industry too.
const INDUSTRY_LOANS = new Set(["business-loan", "private-funding", "machine-loan"]);
// A loan with its own list of industries.
const MACHINE_INDUSTRIES = [
  "Engineering & Manufacturing",
  "Automobile",
  "Textile",
  "Food Processing",
  "Pharma / Healthcare",
  "Plastic",
  "Printing & Packaging",
  "Metal Fabrication",
  "Chemicals",
  "Electrical / Electronics",
  "Construction Materials",
  "Agro Processing",
  "Jewellery",
  "Medical / Diagnostic",
  "Wood, Furniture & Plywood",
  "Rubber Products",
  "Cold Storage & Refrigeration",
  "Other",
];
// Loans whose short form asks for the profession.
const PROFESSION_LOANS = new Set(["professional-loan"]);
// Loan pages whose short form is kept to five questions: no loan type (the page says it) and no email.
const COMPACT_LOANS = new Set(["professional-loan"]);
const PROFESSIONS = [
  "Doctor or dentist",
  "Chartered Accountant",
  "Company Secretary",
  "Architect",
  "Engineer",
  "Lawyer",
  "Other",
];

type Fields = {
  name: string;
  phone: string;
  email: string;
  loanType: string;
  loanTypeOther: string;
  applicantCategory: string;
  industry: string;
  profession: string;
  /** For a loan against property: the kind of loan, and the kind of property. */
  loanKind: string;
  propertyKind: string;
  /** For an education loan: where the student will study, and who the co-applicant is. */
  studyPlace: string;
  coApplicantKind: string;
  /** What was typed when "Other" was picked in the matching drop-down. */
  categoryOther: string;
  industryOther: string;
  professionOther: string;
  city: string;
  cityOther: string;
  loanAmount: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  loanType: "",
  loanTypeOther: "",
  applicantCategory: "",
  industry: "",
  profession: "",
  loanKind: "",
  propertyKind: "",
  studyPlace: "",
  coApplicantKind: "",
  categoryOther: "",
  industryOther: "",
  professionOther: "",
  city: "",
  cityOther: "",
  loanAmount: "",
};

const cardClass =
  "relative overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] dark:bg-card";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";

// Same base styling as fieldClass, minus the native browser arrow.
const selectClass = `${fieldClass} appearance-none cursor-pointer`;

// A real 10-digit Indian mobile number, with an optional country code or leading 0.
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

function AccentBar() {
  return <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />;
}

function Field({
  id,
  label,
  error,
  required = true,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
      >
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </div>
  );
}

// Groups typed digits with Indian comma placement (e.g. 12,50,000) as the user types.
function formatIndianAmount(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
}

export function LeadForm({
  defaultLoanType = "",
  source = "website-enquiry",
  product,
}: {
  defaultLoanType?: string;
  source?: string;
  /** The loan page this form sits on, so its loan is offered even when the drop-down list leaves it out. */
  product?: { slug: string; title: string };
} = {}) {
  const listed = useList("form.loanTypes", FORM_LOAN_TYPES);
  // The list may name this loan differently (or leave it out), so find it by its page and add it if absent.
  const own = product
    ? listed.find((s) => s.slug === product.slug || SLUG_ALIASES[s.slug] === product.slug)
    : undefined;
  const loanTypes =
    product && !own ? [...listed, { title: product.title, slug: product.slug }] : listed;
  const ownTitle = own?.title ?? product?.title;
  const cities = useCities();
  const applicants = useApplicantOptions();
  // The page a chosen loan type belongs to, and the "You Are" and industry questions that go with it.
  const slugFor = (title: string) => {
    // On a loan's own page the page decides the loan, whatever the drop-down list says.
    if (product) return SLUG_ALIASES[product.slug] ?? product.slug;
    const hit = loanTypes.find((s) => s.title === title);
    return hit ? (SLUG_ALIASES[hit.slug] ?? hit.slug) : undefined;
  };
  // Only a loan's own page asks these. On the home and other general pages the short form stays short.
  const categoryOptionsFor = (title: string): string[] | null => {
    if (!product) return null;
    const slug = slugFor(title);
    if (slug && PROPERTY_LOANS[slug]?.applicants.length)
      return [...PROPERTY_LOANS[slug].applicants, "Other"];
    if (slug && CATEGORY_LOANS.has(slug)) return [...applicants, "Other"];
    if (slug && OVERDRAFT_CATEGORY_LOANS.has(slug)) return [...PERSON_ONLY_CATEGORIES, "Other"];
    return null;
  };
  const propertyLoanFor = (title: string) => {
    const slug = product ? slugFor(title) : undefined;
    return slug ? PROPERTY_LOANS[slug] : undefined;
  };
  const asksLapKinds = (title: string) => !!propertyLoanFor(title);
  const isMachine = !!product && product.slug === "machine-loan";
  const asksIndustry = (title: string) => !!product && INDUSTRY_LOANS.has(slugFor(title) ?? "");
  const asksProfession = (title: string) => !!product && PROFESSION_LOANS.has(slugFor(title) ?? "");
  const compact = !!product && COMPACT_LOANS.has(product.slug);
  const uid = useId();
  // Only pre-select a loan type the dropdown actually offers.
  const initial: Fields = {
    ...empty,
    loanType: product
      ? product.title
      : loanTypes.some((s) => s.title === (ownTitle ?? defaultLoanType))
        ? (ownTitle ?? defaultLoanType)
        : "",
  };
  const [values, setValues] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // After a loan with a detailed second form is submitted, that form replaces this one.
  const [followUp, setFollowUp] = useState<{
    pass: FollowUpPass | null;
    basics: Fields & { slug: string; title: string };
    detail: string;
  } | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const setLoanType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setValues((v) => ({
      ...v,
      loanType: e.target.value,
      loanTypeOther: "",
      applicantCategory: categoryOptionsFor(e.target.value)?.includes(v.applicantCategory)
        ? v.applicantCategory
        : "",
      industry: asksIndustry(e.target.value) ? v.industry : "",
      profession: asksProfession(e.target.value) ? v.profession : "",
      loanKind: asksLapKinds(e.target.value) ? v.loanKind : "",
      propertyKind: asksLapKinds(e.target.value) ? v.propertyKind : "",
      studyPlace: asksLapKinds(e.target.value) ? v.studyPlace : "",
      coApplicantKind: asksLapKinds(e.target.value) ? v.coApplicantKind : "",
    }));

  const setCity = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setValues((v) => ({ ...v, city: e.target.value, cityOther: "" }));

  const setLoanAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, loanAmount: formatIndianAmount(e.target.value) }));

  const validate = () => {
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your full name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Please match the requested format — a 10-digit mobile number";
    if (!compact && !isValidEmail(values.email.trim()))
      next.email = "Please match the requested format — name@example.com";
    if (!values.loanType) next.loanType = "Select a loan type";
    else if (values.loanType === "Other" && !values.loanTypeOther.trim())
      next.loanType = "Please enter your loan type";
    if (asksLapKinds(values.loanType)) {
      if (!values.loanKind) next.loanKind = "Select one";
      if (propertyLoanFor(values.loanType)?.properties.length && !values.propertyKind)
        next.propertyKind = "Select one";
      if (propertyLoanFor(values.loanType)?.study && !values.studyPlace)
        next.studyPlace = "Select one";
      if (propertyLoanFor(values.loanType)?.coApplicants && !values.coApplicantKind)
        next.coApplicantKind = "Select one";
    }
    if (categoryOptionsFor(values.loanType) && !values.applicantCategory)
      next.applicantCategory = "Select one";
    if (values.applicantCategory === "Other" && !values.categoryOther.trim())
      next.applicantCategory = "Please tell us";
    if (asksIndustry(values.loanType)) {
      if (!values.industry) next.industry = "Select your industry";
      else if (values.industry === "Other" && !values.industryOther.trim())
        next.industry = "Please tell us your industry";
    }
    if (asksProfession(values.loanType)) {
      if (!values.profession) next.profession = "Select your profession";
      else if (values.profession === "Other" && !values.professionOther.trim())
        next.profession = "Please tell us your profession";
    }
    if (values.loanAmount) {
      // The loan page decides the smallest amount that makes sense (a home loan is not ₹10,000).
      const slug = slugFor(values.loanType);
      const msg = amountProblem(
        Number(values.loanAmount.replace(/\D/g, "")),
        loanAmountBounds(slug),
      );
      if (msg) next.loanAmount = msg;
    }
    if (!values.city) next.city = "Select your city";
    else if (values.city === "Other" && !values.cityOther.trim())
      next.city = "Please enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Hand the enquiry to the CRM. Loan types that match a product page carry its slug,
    // so the CRM files the lead under the right loan product.
    const service = product
      ? { title: product.title, slug: product.slug }
      : loanTypes.find((s) => s.title === values.loanType);
    const pageSlug = service ? (SLUG_ALIASES[service.slug] ?? service.slug) : undefined;
    const productSlug =
      pageSlug && PRODUCTS.some((p) => p.slug === pageSlug) ? pageSlug : undefined;
    const loanType = values.loanType === "Other" ? values.loanTypeOther.trim() : values.loanType;
    const city = values.city === "Other" ? values.cityOther.trim() : values.city;
    const detail = [
      `Loan type: ${loanType}`,
      values.loanKind ? `Type of loan: ${values.loanKind}` : "",
      values.propertyKind
        ? `${propertyLoanFor(values.loanType)?.propertyWord ?? (propertyLoanFor(values.loanType)?.propertyLabel ? "Project" : "Property")}: ${values.propertyKind}`
        : "",
      values.studyPlace ? `Study: ${values.studyPlace}` : "",
      values.coApplicantKind ? `Co-applicant: ${values.coApplicantKind}` : "",
      values.applicantCategory
        ? `Applicant: ${values.applicantCategory === "Other" ? `Other (${values.categoryOther.trim()})` : values.applicantCategory}`
        : "",
      values.industry
        ? `Industry: ${values.industry === "Other" ? `Other (${values.industryOther.trim()})` : values.industry}`
        : "",
      values.profession
        ? `Profession: ${values.profession === "Other" ? `Other (${values.professionOther.trim()})` : values.profession}`
        : "",
    ]
      .filter(Boolean)
      .join(", ");

    setSubmitting(true);
    const lead = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      city,
      ...(productSlug ? { productSlug } : {}),
      amount: values.loanAmount,
      source,
      detail,
    };
    // A loan type with no page of its own (the general "Car Loan", say) can still have a detailed form.
    const formSlug = productSlug ?? service?.slug;
    const second = followUpFor(formSlug);
    if (second) {
      const pass = await submitLeadForFollowUp(lead);
      setSubmitting(false);
      setFollowUp({
        pass,
        basics: { ...values, city, slug: formSlug!, title: values.loanType },
        detail,
      });
      return;
    }
    await submitLead(lead);
    setSubmitting(false);

    setValues(initial);
    setErrors({});
    setShowToast(true);
  };

  const secondForm = followUp ? followUpFor(followUp.basics.slug) : undefined;
  if (followUp && secondForm) {
    const b = followUp.basics;
    return (
      <FollowUpFlow
        form={secondForm}
        pass={followUp.pass}
        firstDetail={followUp.detail}
        // The home page's form is the short one only: after it, just the CIBIL reminder.
        skipQuestions={source === "home-enquiry"}
        basics={{
          name: b.name.trim(),
          phone: b.phone.trim(),
          email: b.email.trim(),
          city: b.city,
          category: forSecondForm(b.applicantCategory, b.slug),
          known: knownFromShortForm(
            b.slug,
            b.loanKind,
            b.propertyKind,
            b.applicantCategory,
            b.studyPlace,
            b.coApplicantKind,
          ),
          industry: b.industry,
          productSlug: b.slug,
          productTitle: b.title,
          source,
          amount: b.loanAmount,
        }}
      />
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={cardClass}>
        <AccentBar />
        <div className="p-6 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-pale/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase dark:bg-gold/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
            Takes less than a minute
          </span>
          <h3 className="mt-4 font-heading text-[1.6rem] leading-tight font-bold text-navy dark:text-white">
            Request a <span className="hero-stat-text">Free Consultation</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Share a few details and an expert will call you back with matched lender options.
          </p>

          <div className="my-5 border-t border-dashed border-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id={`${uid}-name`}
              label="Full Name"
              error={errors.name}
              className="sm:col-span-2"
            >
              <input
                id={`${uid}-name`}
                className={fieldClass}
                value={values.name}
                onChange={set("name")}
                maxLength={100}
                placeholder="Enter your name"
              />
            </Field>

            <Field
              id={`${uid}-phone`}
              label="Phone"
              error={errors.phone}
              className={compact ? "sm:col-span-2" : ""}
            >
              <input
                id={`${uid}-phone`}
                className={fieldClass}
                value={values.phone}
                onChange={set("phone")}
                maxLength={15}
                inputMode="tel"
                placeholder="Your mobile number"
              />
            </Field>

            {!compact ? (
              <Field id={`${uid}-email`} label="Email" error={errors.email}>
                <input
                  id={`${uid}-email`}
                  className={fieldClass}
                  value={values.email}
                  onChange={set("email")}
                  maxLength={255}
                  inputMode="email"
                  placeholder="you@example.com"
                />
              </Field>
            ) : null}

            {product && !compact ? (
              // On a loan's own page the loan is already known, so it is shown, not asked.
              <Field id={`${uid}-loan`} label="Loan Type" error={errors.loanType}>
                <div
                  id={`${uid}-loan`}
                  className={`${fieldClass} flex items-center justify-between gap-2 bg-secondary/50 font-semibold dark:bg-card`}
                >
                  <span>{product.title}</span>
                  <Check className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                </div>
              </Field>
            ) : !compact ? (
              <Field id={`${uid}-loan`} label="Loan Type" error={errors.loanType}>
                <select
                  id={`${uid}-loan`}
                  className={selectClass}
                  value={values.loanType}
                  onChange={setLoanType}
                >
                  <option value="">Select loan type</option>
                  {loanTypes.map((s) => (
                    <option key={s.slug || s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {values.loanType === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.loanTypeOther}
                    onChange={set("loanTypeOther")}
                    maxLength={100}
                    placeholder="Enter your loan type"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {asksLapKinds(values.loanType) ? (
              <>
                <Field
                  id={`${uid}-lap-kind`}
                  label="Type of Loan"
                  error={errors.loanKind}
                  className="sm:col-span-2"
                >
                  <select
                    id={`${uid}-lap-kind`}
                    className={selectClass}
                    value={values.loanKind}
                    onChange={set("loanKind")}
                  >
                    <option value="">Select one</option>
                    {(propertyLoanFor(values.loanType)?.kinds ?? []).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </Field>
                {propertyLoanFor(values.loanType)?.properties.length ? (
                  <Field
                    id={`${uid}-property-kind`}
                    label={propertyLoanFor(values.loanType)?.propertyLabel ?? "Type of Property"}
                    error={errors.propertyKind}
                    className="sm:col-span-2"
                  >
                    <select
                      id={`${uid}-property-kind`}
                      className={selectClass}
                      value={values.propertyKind}
                      onChange={set("propertyKind")}
                    >
                      <option value="">Select one</option>
                      {(propertyLoanFor(values.loanType)?.properties ?? []).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
                {propertyLoanFor(values.loanType)?.study ? (
                  <Field
                    id={`${uid}-study`}
                    label="Study"
                    error={errors.studyPlace}
                    className="sm:col-span-2"
                  >
                    <select
                      id={`${uid}-study`}
                      className={selectClass}
                      value={values.studyPlace}
                      onChange={set("studyPlace")}
                    >
                      <option value="">Select one</option>
                      {(propertyLoanFor(values.loanType)?.study ?? []).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
                {propertyLoanFor(values.loanType)?.coApplicants ? (
                  <Field
                    id={`${uid}-co-applicant`}
                    label="Co-applicant"
                    error={errors.coApplicantKind}
                    className="sm:col-span-2"
                  >
                    <select
                      id={`${uid}-co-applicant`}
                      className={selectClass}
                      value={values.coApplicantKind}
                      onChange={set("coApplicantKind")}
                    >
                      <option value="">Select one</option>
                      {(propertyLoanFor(values.loanType)?.coApplicants ?? []).map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
              </>
            ) : null}

            {categoryOptionsFor(values.loanType) ? (
              <Field
                id={`${uid}-applicant-category`}
                label="You Are"
                error={errors.applicantCategory}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-applicant-category`}
                  className={selectClass}
                  value={values.applicantCategory}
                  onChange={set("applicantCategory")}
                >
                  <option value="">Select one</option>
                  {(categoryOptionsFor(values.loanType) ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.applicantCategory === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.categoryOther}
                    onChange={set("categoryOther")}
                    maxLength={100}
                    placeholder="Please tell us what you are"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {asksIndustry(values.loanType) ? (
              <Field
                id={`${uid}-industry`}
                label={isMachine ? "Type of Industry" : "Industry"}
                error={errors.industry}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-industry`}
                  className={selectClass}
                  value={values.industry}
                  onChange={set("industry")}
                >
                  <option value="">Select your industry</option>
                  {(isMachine ? MACHINE_INDUSTRIES : INDUSTRIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.industry === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.industryOther}
                    onChange={set("industryOther")}
                    maxLength={100}
                    placeholder="Enter your industry"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {asksProfession(values.loanType) ? (
              <Field
                id={`${uid}-profession`}
                label="Profession"
                error={errors.profession}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-profession`}
                  className={selectClass}
                  value={values.profession}
                  onChange={set("profession")}
                >
                  <option value="">What is your profession?</option>
                  {PROFESSIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.profession === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.professionOther}
                    onChange={set("professionOther")}
                    maxLength={100}
                    placeholder="Enter your profession"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            <Field id={`${uid}-city`} label="City" error={errors.city}>
              <select
                id={`${uid}-city`}
                className={selectClass}
                value={values.city}
                onChange={setCity}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {values.city === "Other" ? (
                <input
                  className={`${fieldClass} mt-2`}
                  value={values.cityOther}
                  onChange={set("cityOther")}
                  maxLength={100}
                  placeholder="Enter your city"
                  autoFocus
                />
              ) : null}
            </Field>

            <Field
              id={`${uid}-amount`}
              label="Loan Amount"
              error={errors.loanAmount}
              required={false}
              className="sm:col-span-2"
            >
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-muted-foreground">
                  ₹
                </span>
                <input
                  id={`${uid}-amount`}
                  className={`${fieldClass} pl-7`}
                  value={values.loanAmount}
                  onChange={setLoanAmount}
                  inputMode="numeric"
                  placeholder="e.g. 5,00,000"
                />
              </div>
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group mt-6 flex w-full items-center justify-center gap-3 disabled:opacity-70 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
          >
            Submit
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground italic">
            {product && SERVICE_FEE_SLUGS.has(product.slug)
              ? "Kept confidential and called back within a day. The consultation is free, and any service fee is shared in writing before you go ahead."
              : "Kept confidential. Called back within a day. Free to you."}
          </p>
        </div>
      </form>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Query received — we'll reach out to you soon."
      />
    </>
  );
}
