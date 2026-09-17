import {
  Building,
  Building2,
  Calculator,
  ClipboardList,
  FileCheck,
  FileText,
  Gift,
  Globe,
  HardHat,
  HeartHandshake,
  IdCard,
  KeyRound,
  Landmark,
  Megaphone,
  Receipt,
  ScrollText,
  Search,
  ShieldCheck,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ServiceDivision = "CA Services" | "Sheetal Associates";

export type ProfessionalService = {
  slug: string;
  icon: LucideIcon;
  division: ServiceDivision;
  category: string;
  title: string;
  summary: string;
  whoNeedsIt: string;
  process: string[];
  documents: string[];
};

/** Display order for each division's categories on the listing page. */
export const SERVICE_DIVISIONS: { division: ServiceDivision; categories: string[] }[] = [
  {
    division: "CA Services",
    categories: ["Tax & Income Tax", "GST & Compliance", "Accounting & Audit", "Business Registration"],
  },
  {
    division: "Sheetal Associates",
    categories: [
      "Property Legal Services",
      "Housing Society Services",
      "SRA / MHADA / MMRDA",
      "Redevelopment",
      "Legal Drafting",
      "NRI & Family Property Services",
    ],
  },
];

const KYC = "PAN, Aadhaar and address proof";

/**
 * CA Services and Sheetal Associates are associated professionals GCS
 * connects clients to — not regulated work GCS performs itself. Keep copy
 * factual/process-level (no personal claims, no invented credentials).
 */
export const PROFESSIONAL_SERVICES: ProfessionalService[] = [
  // ── CA Services · Tax & Income Tax ─────────────────────
  {
    slug: "income-tax-return-filing",
    icon: FileText,
    division: "CA Services",
    category: "Tax & Income Tax",
    title: "Income Tax Return Filing",
    summary:
      "ITR filing support for salaried individuals, professionals, business owners and firms, matched to the correct ITR form for your income type. We handle everything from Form 16 reconciliation to e-filing and the acknowledgement receipt.",
    whoNeedsIt:
      "Anyone with taxable income who needs to file a return — salaried, self-employed or a firm. Also useful if you've missed a filing deadline in a prior year and need to catch up correctly.",
    process: [
      "Share your income sources and documents for review",
      "Correct ITR form identified and return prepared",
      "Return shared with you for confirmation before filing",
      "Filed and acknowledgement shared with you",
    ],
    documents: [KYC, "Form 16 or income proof", "Bank statements", "Investment/deduction proofs, if applicable"],
  },
  {
    slug: "tax-planning-advisory",
    icon: Calculator,
    division: "CA Services",
    category: "Tax & Income Tax",
    title: "Tax Planning & Advisory",
    summary:
      "Guidance on deductions, exemptions, advance tax and tax-efficient structuring based on your income profile. We look at your full financial picture, not just the current year's filing, before recommending a plan.",
    whoNeedsIt:
      "Individuals and businesses wanting to plan ahead rather than react at filing time. Particularly useful if your income has changed recently — a new job, a bonus, a property sale, or a new business.",
    process: [
      "Review of current income, investments and tax position",
      "Applicable deductions and structuring options discussed",
      "A practical plan for the year, including advance-tax dates where relevant",
    ],
    documents: [KYC, "Latest ITR or income details", "Existing investment/insurance summary"],
  },
  {
    slug: "tds-return-filing",
    icon: Receipt,
    division: "CA Services",
    category: "Tax & Income Tax",
    title: "TDS Return Filing",
    summary:
      "TDS compliance and quarterly return filing for salary, commission, rent, professional fees and other applicable payments. We reconcile challans against deductions before filing, so mismatches don't surface later as notices.",
    whoNeedsIt:
      "Businesses and individuals required to deduct and report TDS on payments they make. Also useful if you've received a TDS mismatch notice and need help correcting a prior filing.",
    process: [
      "Deduction details for the quarter collected and reviewed",
      "Return prepared and challans reconciled",
      "Filed within the applicable due date, with Form 16/16A support",
    ],
    documents: ["TAN details", "Deduction and payment records for the quarter", "Challan details"],
  },
  {
    slug: "tds-property-sale-26qb",
    icon: Building2,
    division: "CA Services",
    category: "Tax & Income Tax",
    title: "TDS on Property Sale — Form 26QB",
    summary:
      "Assistance with the applicable TDS compliance when buying a property above the notified threshold, including Form 26QB filing. We also help generate Form 16B for the seller once the deposit is confirmed.",
    whoNeedsIt:
      "Buyers and sellers in a property transaction where TDS on the sale consideration applies. This typically comes up on transactions above ₹50 lakh, where the buyer must deduct and deposit TDS before registration.",
    process: [
      "Transaction details and applicability reviewed",
      "Form 26QB prepared and TDS deposited",
      "Form 16B generated for the seller",
    ],
    documents: [KYC, "Sale agreement", "PAN of buyer and seller"],
  },

  // ── CA Services · GST & Compliance ─────────────────────
  {
    slug: "gst-registration",
    icon: ClipboardList,
    division: "CA Services",
    category: "GST & Compliance",
    title: "GST Registration",
    summary:
      "New GST registration support, including document preparation and application follow-up. We track the application through the portal until the GSTIN is issued, resolving any department queries along the way.",
    whoNeedsIt:
      "Businesses crossing the GST threshold, or those who need GST registration voluntarily. Also relevant if you're expanding into e-commerce or inter-state supply, where registration is mandatory regardless of turnover.",
    process: [
      "Business details and documents reviewed for eligibility",
      "Application prepared and submitted on the GST portal",
      "Follow-up on queries until registration is granted",
    ],
    documents: [KYC, "Business proof (registration certificate, partnership deed, etc.)", "Business address proof", "Bank account details"],
  },
  {
    slug: "gst-return-filing",
    icon: FileCheck,
    division: "CA Services",
    category: "GST & Compliance",
    title: "GST Return Filing & Compliance",
    summary:
      "Monthly/quarterly GSTR-1 and GSTR-3B filing along with ongoing GST compliance support. We reconcile sales and purchase data each cycle so your returns match your books and your GSTR-2B.",
    whoNeedsIt:
      "GST-registered businesses that need regular, on-time return filing. Suited to businesses that would rather hand off the monthly compliance grind than track due dates themselves.",
    process: [
      "Sales and purchase data collected for the period",
      "Returns prepared and shared for review",
      "Filed within the due date each cycle",
    ],
    documents: ["Sales and purchase registers", "GST login credentials", "Bank statements, if required for reconciliation"],
  },
  {
    slug: "gst-reconciliation-notice-support",
    icon: Search,
    division: "CA Services",
    category: "GST & Compliance",
    title: "GST Reconciliation & Notice Support",
    summary:
      "GSTR-2B/books reconciliation and professional assistance in responding to applicable GST notices. We identify exactly where the mismatch originates before drafting any response to the department.",
    whoNeedsIt:
      "Businesses with mismatches between books and GST returns, or who've received a GST notice. Also useful ahead of an annual return or audit, to clear up discrepancies before they get flagged.",
    process: [
      "Books and GST returns reconciled to identify gaps",
      "Root cause reviewed and corrective filing planned",
      "Notice, if any, reviewed and a response prepared",
    ],
    documents: ["GST returns filed to date", "Books of accounts", "Copy of notice, if applicable"],
  },

  // ── CA Services · Accounting & Audit ───────────────────
  {
    slug: "accounting-bookkeeping",
    icon: Calculator,
    division: "CA Services",
    category: "Accounting & Audit",
    title: "Accounting & Bookkeeping",
    summary:
      "Monthly bookkeeping, ledger maintenance, bank reconciliation and financial statement preparation. Your books stay current through the year, so tax filing and audit season don't turn into a scramble.",
    whoNeedsIt:
      "Businesses and professionals who want their books maintained on an ongoing basis. A good fit if you currently rely on scattered spreadsheets or an in-house team stretched too thin to keep up.",
    process: [
      "Transaction data and bank statements shared each month",
      "Books updated and reconciled",
      "Financial statements shared periodically",
    ],
    documents: ["Bank statements", "Sales/purchase invoices", "Expense records"],
  },
  {
    slug: "tax-audit-support",
    icon: ShieldCheck,
    division: "CA Services",
    category: "Accounting & Audit",
    title: "Tax Audit Support",
    summary:
      "Support for tax audit and GST-related audit/compliance requirements, for taxpayers to whom audit applies. We work through the applicable checklist and reconcile records well before the filing deadline.",
    whoNeedsIt:
      "Businesses and professionals whose turnover or profile brings them under applicable audit requirements. Also useful if this is your first year crossing the audit threshold and you're unsure what's expected.",
    process: [
      "Applicability of audit reviewed against your turnover/profile",
      "Books and records reviewed and reconciled",
      "Audit report prepared and filed within the due date",
    ],
    documents: ["Books of accounts", "Bank statements", "Prior year's audit report, if applicable"],
  },

  // ── CA Services · Business Registration ────────────────
  {
    slug: "company-llp-registration",
    icon: Building2,
    division: "CA Services",
    category: "Business Registration",
    title: "Company & LLP Registration",
    summary:
      "Incorporation support for Private Limited Companies and LLPs, including the applicable MCA documentation. We coordinate the DSC, DIN, name approval and incorporation filing as one continuous process.",
    whoNeedsIt:
      "Founders setting up a new company or LLP, or converting from a proprietorship/partnership. Also relevant if you're bringing in a co-founder or investor and need a formal corporate structure in place.",
    process: [
      "Structure, name and documentation requirements discussed",
      "DSC, DIN and incorporation forms prepared and filed with MCA",
      "Certificate of Incorporation, PAN and TAN obtained",
    ],
    documents: [KYC, "Registered office proof", "Passport-size photographs", "Digital Signature Certificate (DSC)"],
  },
  {
    slug: "msme-udyam-registration",
    icon: Store,
    division: "CA Services",
    category: "Business Registration",
    title: "MSME / Udyam Registration",
    summary:
      "Udyam registration assistance for eligible micro, small and medium enterprises. Getting registered typically unlocks priority-sector lending, government tenders and other MSME-specific benefits.",
    whoNeedsIt:
      "Proprietorships, partnerships and companies eligible for MSME classification. Especially useful before applying for a business loan, since several lenders ask for Udyam registration upfront.",
    process: [
      "Business and investment/turnover details reviewed",
      "Udyam application filed against your PAN",
      "Udyam certificate shared once generated",
    ],
    documents: [KYC, "Business PAN", "Bank account and GST details, if applicable"],
  },
  {
    slug: "shop-act-fssai-registration",
    icon: Store,
    division: "CA Services",
    category: "Business Registration",
    title: "Shop Act (Gumasta) & FSSAI Registration",
    summary:
      "Maharashtra Shop & Establishment (Gumasta) registration, and FSSAI registration/licensing for eligible food businesses. We identify which registration actually applies to your setup before filing anything.",
    whoNeedsIt:
      "Businesses operating a physical establishment in Maharashtra, or those dealing in food products. Also relevant when opening a new outlet, since Gumasta registration is typically required per location.",
    process: [
      "Applicable registration(s) identified for your business",
      "Application prepared with the required premises/business documents",
      "Registration/licence obtained and shared with you",
    ],
    documents: [KYC, "Premises proof (rent agreement/ownership document)", "Business constitution proof"],
  },
  {
    slug: "pan-tan-dsc-services",
    icon: IdCard,
    division: "CA Services",
    category: "Business Registration",
    title: "PAN, TAN & DSC Services",
    summary:
      "Application assistance for PAN, TAN and Digital Signature Certificates for individuals and businesses. We also help with corrections — a misspelled name or an outdated address — on an existing PAN.",
    whoNeedsIt:
      "New businesses, or anyone needing a fresh PAN/TAN/DSC or a correction to an existing one. A DSC in particular is usually a prerequisite before any MCA or GST filing can be submitted.",
    process: [
      "Requirement and applicant details confirmed",
      "Application prepared and submitted with supporting documents",
      "PAN/TAN/DSC shared with you once issued",
    ],
    documents: [KYC, "Business registration proof, for TAN/DSC in a company or firm's name"],
  },

  // ── Sheetal Associates · Property Legal Services ───────
  {
    slug: "property-title-verification",
    icon: Search,
    division: "Sheetal Associates",
    category: "Property Legal Services",
    title: "Property Title Verification & Due Diligence",
    summary:
      "Review of ownership documents, title chain, encumbrances and approvals before a property purchase. We flag anything that could complicate the sale — a pending litigation, an unclear share, or a missing approval — before you commit funds.",
    whoNeedsIt:
      "Buyers wanting a professional check on a property's title and documentation before committing. Especially important for resale flats, ancestral property, or anything without a clean, recent chain of ownership.",
    process: [
      "Property and seller documents collected",
      "Title chain, encumbrances and approvals reviewed",
      "Written observations shared with you",
    ],
    documents: ["Title documents/chain", "7/12 extract or property card", "Encumbrance certificate, where available"],
  },
  {
    slug: "sale-agreement-sale-deed",
    icon: ScrollText,
    division: "Sheetal Associates",
    category: "Property Legal Services",
    title: "Sale Agreement & Sale Deed Drafting",
    summary:
      "Drafting and registration assistance for sale agreements and sale deeds in a property transaction. We coordinate stamp duty payment and the registration appointment so the transaction closes cleanly.",
    whoNeedsIt:
      "Buyers and sellers finalising a property purchase or sale. Also useful for structuring a phased payment schedule between the agreement and the final sale deed.",
    process: [
      "Transaction terms and party details confirmed",
      "Agreement/deed drafted for both parties' review",
      "Stamp duty coordination and registration assistance",
    ],
    documents: [KYC, "Property title documents", "Previous agreement, if any"],
  },
  {
    slug: "gift-release-deed",
    icon: Gift,
    division: "Sheetal Associates",
    category: "Property Legal Services",
    title: "Gift Deed & Release Deed Documentation",
    summary:
      "Drafting assistance for gift deeds and release/relinquishment deeds for family property transfers. Both documents are drafted to withstand scrutiny later, with the right stamp duty and registration handled from the start.",
    whoNeedsIt:
      "Families transferring property between members without a sale, or releasing a share in jointly held property. Common after a family settlement, when one sibling wants to formally give up their share to another.",
    process: [
      "Relationship, property details and intent confirmed",
      "Deed drafted and shared for review",
      "Stamp duty coordination and registration assistance",
    ],
    documents: [KYC, "Property title documents", "Proof of relationship, where relevant"],
  },
  {
    slug: "power-of-attorney-drafting",
    icon: KeyRound,
    division: "Sheetal Associates",
    category: "Property Legal Services",
    title: "Power of Attorney Drafting",
    summary:
      "Drafting of General and Special Power of Attorney documents for property and related matters. We scope the exact powers granted carefully, so the document does what you intend and nothing more.",
    whoNeedsIt:
      "Anyone authorising another person to act on their behalf for a property or legal matter. Especially relevant for NRIs or anyone unable to be physically present for a transaction or registration.",
    process: [
      "Purpose and scope of authority discussed",
      "POA drafted to match the intended use",
      "Execution and registration/notarisation guidance provided",
    ],
    documents: [KYC, "Details of the person being authorised"],
  },

  // ── Sheetal Associates · Housing Society Services ──────
  {
    slug: "society-share-transfer",
    icon: Users,
    division: "Sheetal Associates",
    category: "Housing Society Services",
    title: "Housing Society Share Transfer",
    summary:
      "Documentation support for transferring share certificates and flat ownership within a housing society. We prepare the transfer application in the format each society typically expects, to avoid back-and-forth.",
    whoNeedsIt:
      "Flat owners transferring ownership after a sale, gift or family transfer within a co-operative society. Required whenever a flat changes hands, since the society's own records must be updated alongside the deed.",
    process: [
      "Transfer type and society requirements confirmed",
      "Application and supporting documents prepared",
      "Coordination with the society until the transfer is recorded",
    ],
    documents: [KYC, "Share certificate", "Sale/gift/release deed as applicable", "Society NOC application"],
  },
  {
    slug: "society-noc-membership",
    icon: FileCheck,
    division: "Sheetal Associates",
    category: "Housing Society Services",
    title: "Society NOC & Membership Documentation",
    summary:
      "Assistance obtaining society NOCs and completing membership documentation for a flat. We follow up directly with the managing committee so the NOC doesn't get stuck in a routine backlog.",
    whoNeedsIt:
      "New or existing members needing an NOC for sale, mortgage or other society-related purposes. Also useful if the society is delaying membership paperwork for a flat you've already purchased.",
    process: [
      "Purpose of the NOC/membership request confirmed",
      "Application prepared per the society's format",
      "Follow-up with the society/managing committee",
    ],
    documents: [KYC, "Share certificate", "Reason/purpose for the NOC"],
  },

  // ── Sheetal Associates · SRA / MHADA / MMRDA ───────────
  {
    slug: "sra-flat-transfer",
    icon: Building,
    division: "Sheetal Associates",
    category: "SRA / MHADA / MMRDA",
    title: "SRA Flat Transfer Documentation",
    summary:
      "Documentation assistance for transferring an SRA (Slum Rehabilitation Authority) flat, subject to eligibility. We review the specific SRA scheme's transfer rules before preparing any application.",
    whoNeedsIt:
      "SRA flat owners transferring the flat to a family member or buyer, where permitted. Eligibility and lock-in conditions vary by scheme, so this is worth checking before assuming a transfer is possible.",
    process: [
      "Eligibility and transfer conditions reviewed",
      "Application and supporting documents prepared",
      "Coordination with the relevant authority until completion",
    ],
    documents: [KYC, "SRA allotment/agreement documents", "Reason for transfer"],
  },
  {
    slug: "mhada-flat-transfer",
    icon: Building2,
    division: "Sheetal Associates",
    category: "SRA / MHADA / MMRDA",
    title: "MHADA Flat Transfer Documentation",
    summary:
      "Documentation assistance for MHADA flat transfers, including family transfers, subject to MHADA norms. We coordinate directly with the MHADA office to keep the application moving.",
    whoNeedsIt:
      "MHADA flat owners transferring the flat within the family or to an eligible buyer. Transfer conditions differ by MHADA scheme and lease terms, so it's worth confirming eligibility early.",
    process: [
      "Transfer type and MHADA eligibility reviewed",
      "Application and supporting documents prepared",
      "Coordination with MHADA until the transfer is recorded",
    ],
    documents: [KYC, "MHADA allotment letter/agreement", "Reason for transfer"],
  },
  {
    slug: "mmrda-property-documentation",
    icon: Landmark,
    division: "Sheetal Associates",
    category: "SRA / MHADA / MMRDA",
    title: "MMRDA Property Documentation",
    summary:
      "Documentation assistance for properties involving MMRDA, subject to the applicable scheme's terms. We identify which MMRDA-specific approvals or NOCs your transaction actually needs.",
    whoNeedsIt:
      "Owners of MMRDA-linked properties needing transfer or related documentation support. Also useful if you're unsure which MMRDA scheme your property falls under.",
    process: [
      "Property and scheme details reviewed",
      "Application and supporting documents prepared",
      "Coordination with the relevant authority until completion",
    ],
    documents: ["Allotment/agreement documents", "Reason for the request"],
  },

  // ── Sheetal Associates · Redevelopment ─────────────────
  {
    slug: "society-redevelopment-documentation",
    icon: HardHat,
    division: "Sheetal Associates",
    category: "Redevelopment",
    title: "Society Redevelopment Documentation",
    summary:
      "Documentation support for housing society redevelopment, for individual members, managing committees and developers. We help track consents, agreements and approvals across what's usually a multi-year process.",
    whoNeedsIt:
      "Society members or committees navigating the documentation side of a redevelopment project. Also useful for an individual member trying to understand their own rights and paperwork within a larger redevelopment.",
    process: [
      "Stage of the redevelopment and documentation gap reviewed",
      "Required agreements/consents identified",
      "Documentation prepared and coordinated with the relevant parties",
    ],
    documents: ["Society registration documents", "Existing member/share documents", "Developer agreement, where applicable"],
  },

  // ── Sheetal Associates · Legal Drafting ────────────────
  {
    slug: "legal-drafting-agreements-affidavits",
    icon: ScrollText,
    division: "Sheetal Associates",
    category: "Legal Drafting",
    title: "Legal Drafting — Agreements, Affidavits & Notices",
    summary:
      "Drafting assistance for agreements, affidavits, declarations, undertakings and legal notices. Each document is drafted to your specific facts, not from a generic template that may not hold up if challenged.",
    whoNeedsIt:
      "Individuals and businesses needing a specific document drafted or reviewed. Also useful if you already have a draft and want a professional review before signing.",
    process: [
      "Purpose and key terms of the document discussed",
      "Document drafted and shared for your review",
      "Finalised after your inputs, with execution guidance",
    ],
    documents: [KYC, "Relevant background documents for the matter"],
  },
  {
    slug: "public-notice-publication",
    icon: Megaphone,
    division: "Sheetal Associates",
    category: "Legal Drafting",
    title: "Public Notice Publication",
    summary:
      "Drafting and newspaper publication of public notices — for a lost title deed, a property sale objection window, a name change, or a similar legal requirement. We handle the drafting and coordinate publication in the required newspapers.",
    whoNeedsIt:
      "Anyone needing to publish a notice for a lost document, an intended property sale, a change of name, or a similar legal requirement. Commonly needed before a property transaction closes, to invite objections within the notice period.",
    process: [
      "Purpose and required newspaper(s)/language confirmed",
      "Notice drafted and shared for your approval",
      "Published, with the tear sheet/proof of publication shared with you",
    ],
    documents: [KYC, "Details/proof relevant to the notice (e.g. FIR copy for a lost document, property papers for a sale notice)"],
  },

  // ── Sheetal Associates · NRI & Family Property Services ─
  {
    slug: "nri-property-documentation",
    icon: Globe,
    division: "Sheetal Associates",
    category: "NRI & Family Property Services",
    title: "NRI Property Documentation",
    summary:
      "Documentation support for NRIs on property purchase, sale, transfer and Power of Attorney matters. We structure the paperwork for remote execution, so a trip back to India isn't always necessary.",
    whoNeedsIt:
      "NRIs handling a property matter in India remotely, or through a Power of Attorney holder. Especially useful when time zones and travel make in-person visits to registrars or societies impractical.",
    process: [
      "Requirement and location of the property confirmed",
      "Documents drafted and shared for remote execution",
      "Coordination with the POA holder/local representative as needed",
    ],
    documents: ["Passport/OCI details", "Property title documents", "POA, if a representative will act locally"],
  },
  {
    slug: "will-succession-documentation",
    icon: HeartHandshake,
    division: "Sheetal Associates",
    category: "NRI & Family Property Services",
    title: "Will & Succession Documentation",
    summary:
      "Drafting assistance for Wills, and documentation support for legal heir and succession matters. We also help coordinate the succession certificate or legal heir documentation needed after a death in the family.",
    whoNeedsIt:
      "Individuals wanting to draft a Will, or families handling succession documentation after a death in the family. Especially useful when multiple legal heirs are involved and consensus documentation is needed.",
    process: [
      "Assets and intended distribution discussed, or succession situation reviewed",
      "Document(s) drafted and shared for review",
      "Execution/registration guidance, or coordination for succession documentation",
    ],
    documents: [KYC, "Asset/property details", "Death certificate and family details, for succession matters"],
  },
];

export const getProfessionalService = (slug: string) =>
  PROFESSIONAL_SERVICES.find((s) => s.slug === slug);
