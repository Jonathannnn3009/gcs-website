"""Checklist content for the loan products.

The eight families built from the Word files in the project root use their full
wording (typos fixed: Aadhar -> Aadhaar, Reliving -> Relieving). The other loan
products reuse the same shared blocks so every list says the same thing.
"""

# ── shared blocks (taken from the Word files) ─────────────────────────────
KYC_INDIVIDUAL = {
    "title": "KYC Documents",
    "note": "Applicant & Co-Applicant(s)",
    "items": [
        "Photo ID — PAN card, Aadhaar card & Passport",
        "Address proof — Electricity bill, Rent agreement (if applicable), Telephone bill, Passport",
        "Permanent address proof, if current residence address is different",
        "Passport size photograph",
    ],
}

KYC_BUSINESS = {
    "title": "KYC Documents",
    "note": "Applicant, Co-Applicant(s) — all Partners or Directors",
    "items": [
        "Photo ID — PAN card & Aadhaar card",
        "Address proof, residence & office — Latest electricity bill (if rented — rent agreement), "
        "Telephone bill, Passport (if available)",
        "Permanent address proof, if current residence address is different",
        "Passport size photograph",
    ],
}


def employment_income(slips: int, title="Income Documents", note="For salaried persons"):
    return {
        "title": title,
        "note": note,
        "items": [
            "Employment proof — Company ID / Offer letter / Appointment letter / Increment letter & "
            "previous company relieving letter, if any. (require 3 year continuity proof)",
            f"Latest {slips} months salary slips",
            "Latest 12 months salary and savings account statements",
            "Latest 2 years Form 16 (Part A & Part B) & Form 26AS",
            "ITR of last 2 years (if income is taxable)",
            "!Other rent income (if any) — rent agreement along with rent reflection in bank statements",
            "!In case of any existing loan, require all loan sanction letters & Loan SOA "
            "(EMI obligation & details sheet)",
        ],
    }


SELF_EMPLOYED_CORE = [
    "Latest 3 years ITRs, BS & P&L statements and Computation of Income (COI), duly certified / audited by a "
    "Chartered Accountant with UIDN — with full financials including 3CB & 3CD, Audit Report and all schedules",
    "Latest 12 months business Current and Savings account bank statements "
    "(all existing loan EMI reflection account statements)",
    "Latest 2 years Form 26AS",
]
GSTR = "Latest 12 months GSTR 3B"


def self_employed_income(extra=(), gstr=True, title="Income Documents", note="For businessman / self-employed"):
    items = list(SELF_EMPLOYED_CORE) + ([GSTR] if gstr else []) + list(extra)
    return {"title": title, "note": note, "items": items}


BUSINESS_PROOF = {
    "title": "Business Proof",
    "note": "As per your business type",
    "items": [
        "[[Proprietor]] Shop Act licence, Udyam registration certificate, GST registration certificate",
        "[[Partnership firm]] PAN card, registered Partnership Deed, list of Partners & shareholding pattern on "
        "company letterhead duly attested by CA, Shop Act licence, Udyam registration certificate, GST "
        "registration certificate",
        "[[Pvt Ltd company]] PAN card, Memorandum & Articles of Association (MOA & AOA) / Resolution, list of "
        "Directors & Shareholders on company letterhead duly attested by CA, Certificate of Incorporation, "
        "Shop Act licence, Udyam registration certificate, GST registration certificate",
    ],
}

RENT_AND_EXISTING_LOANS = {
    "title": "Rental Income & Existing Loans",
    "items": [
        "!Other rent income (if any) — rent agreement along with rent reflection in bank statements",
        "!In case of any existing loan, require all loan sanction letters & Loan SOA "
        "(EMI obligation & details sheet)",
    ],
}


def balance_transfer(with_lod=True):
    items = [
        "Sanction letter",
        "Loan SOA — Statement of Account from beginning till date",
    ]
    if with_lod:
        items.append("LOD — List of Documents")
    items.append("Foreclosure letter")
    return {"title": "Balance Transfer Case", "note": "If you are moving an existing loan", "items": items}


PROPERTY_RESALE_ITEMS = [
    "Draft agreement",
    "Conveyance deed",
    "Sale agreement along with chain agreements, if any",
    "Share certificate, Society registration certificate",
    "Property card, Title certificate (if applicable)",
    "CC, OC or sanctioned / approved plan copy",
    "Latest electricity bill, maintenance bill and property tax receipt",
]
PROPERTY_BUILDER_ITEMS = [
    "Draft agreement",
    "Cost sheet provided by builder, OCR payment receipts",
    "Brochure of property, MAHA RERA No.",
    "CC, approved plan copy",
    "APF details — list of banks and their APF number",
    "Builder contact person details — e.g. name and number",
]
PROPERTY_MORTGAGE_ITEMS = [  # no draft agreement: the property is already owned
    "Conveyance deed",
    "Sale agreement along with chain agreements, if any",
    "Share certificate, Society registration certificate",
    "Property card, Title certificate (if applicable)",
    "CC, OC or sanctioned / approved plan copy",
    "Latest electricity bill, maintenance bill and property tax receipt",
]


def property_resale(title="Property Docs — Resale"):
    return {"title": title, "items": PROPERTY_RESALE_ITEMS}


def property_builder(title="Property Docs — Builder Purchase"):
    return {"title": title, "items": PROPERTY_BUILDER_ITEMS}


# ── the eight Word-file families ──────────────────────────────────────────
HOME_LOAN_SALARIED = dict(
    title="Home Loan — Salaried Applicant",
    sections=[
        KYC_INDIVIDUAL,
        employment_income(4),
        balance_transfer(),
        property_resale(),
        property_builder(),
    ],
)

HOME_LOAN_SELF_EMPLOYED = dict(
    title="Home Loan — Self-Employed Applicant",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        RENT_AND_EXISTING_LOANS,
        balance_transfer(),
        property_resale(),
        property_builder(),
    ],
)

HOME_LOAN_NRI = dict(
    title="Home Loan — NRI (Salaried) Applicant",
    sections=[
        {
            "title": "NRI Document Checklist",
            "note": "Specific to NRI applicants",
            "items": [
                "CIBIL — credit bureau report of that country (if applicable)",
                "CDC certificate (Continuous Discharge Certificate)",
                "Resident Indian (should be a blood relative of the NRI) as co-applicant — co-applicant's "
                "PAN card copy & residence address proof",
                "Copy of valid Visa stamped on Passport",
                "Copy of employment contract",
                "Copy of last filed Income Tax Return — Form W2 (US) / P60 (UK) / ITR / Indian ITRs (if filed)",
                "Customer should be a confirmed employee — contract copies",
                "Embassy / Consulate / local specialised vendor in India",
                "Details of HR person — name, contact no., designation and email ID",
                "Copy of Leave & Licence agreement of shop (if applicable)",
                "Copy of POA (to be allowed), if the customer is not in India to sign the agreement",
                "Obligation details",
            ],
        },
        KYC_INDIVIDUAL,
        {
            "title": "Income Documents",
            "note": "For salaried persons",
            "items": [
                "Employment proof — Company ID / Offer letter / Appointment letter / Increment letter & "
                "previous company relieving letter, if any. (require 3 year continuity proof)",
                "Latest 6 months salary slips",
                "Latest 12 months salary and savings account statements",
                "12 months bank statements of salary account and other active accounts of the applicant, "
                "including NRE / NRO accounts",
                "Latest 2 years Form 16 (Part A & Part B) & Form 26AS",
                "ITR of last 2 years (if income is taxable)",
                "!Other rent income (if any) — rent agreement along with rent reflection in bank statements",
                "!In case of any existing loan, require all loan sanction letters & Loan SOA "
                "(EMI obligation & details sheet)",
            ],
        },
        balance_transfer(),
        property_resale(),
        property_builder(),
    ],
)

PERSONAL_LOAN = dict(
    title="Personal Loan",
    sections=[
        KYC_INDIVIDUAL,
        employment_income(4),
        balance_transfer(with_lod=False),
    ],
)

CAR_LOAN = dict(
    title="Car Loan",
    sections=[
        {**KYC_BUSINESS, "note": "Applicant & Co-Applicant(s)"},
        {
            **employment_income(6, title="Income — Salaried Persons", note=None),
        },
        self_employed_income(title="Income — Businessman / Self-Employed", note=None),
        BUSINESS_PROOF,
        RENT_AND_EXISTING_LOANS,
        {
            "title": "Car Dealer Documents",
            "items": ["Car quotation", "Down payment dealer receipt"],
        },
    ],
)

# The Word file's own "Customer Details sheet for Education Loan" (3-column grid)
_PERSON_FIELDS = [
    ("Name", 2), ("Contact number (Indian & abroad, if any)", 1),
    ("Current address", 3), ("Permanent address", 3),
    ("Years at current address", 1), ("Personal email ID", 1), ("Qualification", 1),
    ("Designation", 1), ("Office name", 1), ("Office email ID", 1),
    ("Office address", 3),
    ("Total years of working experience", 1.5), ("Current company work experience", 1.5),
]

EDUCATION_LOAN = dict(
    title="Education Loan",
    sections=[
        {
            "title": "Student Documents",
            "items": [
                "PAN card, Aadhaar card and Passport",
                "10th, 12th & Graduation marksheets",
                "Entrance exam marksheet (e.g. GMAT, GRE, IELTS, TOEFL, etc.)",
                "University admission letter",
                "Passport size photo",
                "Latest 4 months salary slips ( if currently doing a job )",
                "Experience letter ( if available )",
                "Updated CV",
            ],
        },
        {
            "title": "Financial Co-Applicant",
            "note": "Mother & Father / Guardian",
            "items": [
                "PAN card, Aadhaar card & Passport",
                "Ownership proof — Latest electricity bill / maintenance receipt etc.",
                "Passport size photo",
            ],
        },
        employment_income(4, title="Co-Applicant Income — Salaried", note="For salaried persons"),
        self_employed_income(
            gstr=False,
            title="Co-Applicant Income — Self-Employed",
            note="For businessman / self-employed",
        ),
        BUSINESS_PROOF,
        {
            "title": "Collateral / Property Docs",
            "note": "Depends on loan amount — for secured cases",
            "items": [
                "Conveyance deed",
                "Sale agreement along with chain agreements, if any",
                "Share certificate, Society registration certificate",
                "Property card, Title certificate (if applicable)",
                "CC, OC or sanctioned / approved plan copy",
                "Latest electricity bill, maintenance bill & property tax receipt",
            ],
        },
        {
            "callout": "<b>Note:</b> we may ask for some more documents after the credit review. "
            "Please also fill in the Customer Details Sheet on the next page(s)."
        },
        {
            "title": "Customer Details Sheet — Education Loan",
            "note": "Fill in and send back with your documents",
            "cols": 3,
            "form": [
                ("Student", [
                    ("Student's name", 2), ("Contact no.", 1),
                    ("Email ID", 2), ("Years at current address", 1),
                    ("Current address", 3), ("Permanent address", 3),
                ]),
                ("Father  (Mr.)", _PERSON_FIELDS),
                ("Mother  (Mrs.)", _PERSON_FIELDS),
                ("Grandmothers", [
                    ("Grandmother's name (father's mother)", 1.5),
                    ("Grandmother's name (mother's mother)", 1.5),
                ]),
                ("Student Friends — Reference (Two)", [
                    ("1) Name", 1), ("Contact no.", 1), ("Address", 1),
                    ("2) Name", 1), ("Contact no.", 1), ("Address", 1),
                ]),
                ("Loan Details", [
                    ("Loan amount (Lakh / Cr)", 1), ("Course name", 1), ("Course duration", 1),
                    ("Course start date", 1), ("University name", 1), ("Country", 1),
                ]),
            ],
        },
    ],
)

LAP_DLOD = dict(
    title="LAP / DLOD — Self-Employed",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        RENT_AND_EXISTING_LOANS,
        balance_transfer(),
        {
            "title": "Property Docs",
            "note": "Residential / Commercial / Industrial — Mortgage Loan (LAP)",
            "items": PROPERTY_MORTGAGE_ITEMS,
        },
    ],
)

WCL_CC_OD_LC_BG = dict(
    title="Working Capital — CC/OD, LC/BG",
    sections=[
        KYC_BUSINESS,
        self_employed_income(
            extra=[
                "List of Debtors & Creditors for the last year",
                "CA attested Net worth certificate",
                "Brief profile details of all companies",
            ],
            title="Income & Financial Documents",
        ),
        BUSINESS_PROOF,
        RENT_AND_EXISTING_LOANS,
        balance_transfer(),
        {
            "title": "Property Docs — Mortgage / Purchase (Resale)",
            "note": "Commercial / Industrial",
            "items": PROPERTY_RESALE_ITEMS,
        },
        {
            "title": "Property Docs — Builder Purchase",
            "note": "Commercial / Industrial",
            "items": PROPERTY_BUILDER_ITEMS,
        },
    ],
)

# ── other loan products (same shared blocks, plus their own extras) ───────
BALANCE_TRANSFER_PRODUCT = dict(
    title="Balance Transfer",
    sections=[
        KYC_INDIVIDUAL,
        employment_income(4, title="Employment & Income"),
        balance_transfer(),
        {"title": "Property Docs (If Secured)", "items": PROPERTY_RESALE_ITEMS},
    ],
)

BUSINESS_LOAN = dict(
    title="Business Loan",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        {
            "title": "Additional Documents",
            "items": [
                "Proof of business ownership",
                "Existing loan sanction letter and latest SOA, if any",
            ],
        },
    ],
)

CGTMSE = dict(
    title="CGTMSE Funding",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        {
            "title": "CGTMSE-Specific Documents",
            "items": ["Udyam / MSME registration certificate", "Project report / business plan"],
        },
    ],
)

LEASE_RENTAL = dict(
    title="Lease Rental Discounting",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        {
            "title": "Lease & Rental Documents",
            "items": [
                "Registered lease / rent agreement",
                "Last 12 months rent receipts / bank statements showing rent credits",
                "Tenant details & residual lease tenure",
                "Escrow account details, if the rent is routed through one",
            ],
        },
        {"title": "Property Docs", "items": PROPERTY_RESALE_ITEMS},
    ],
)

UNSECURED_TERM_LOAN = dict(
    title="Unsecured Term Loan",
    sections=[KYC_BUSINESS, self_employed_income(), BUSINESS_PROOF],
)

UNSECURED_DOD = dict(
    title="Unsecured DOD",
    sections=[KYC_BUSINESS, self_employed_income(), BUSINESS_PROOF],
)

PROJECT_FUNDING = dict(
    title="Project Funding",
    sections=[
        KYC_BUSINESS,
        self_employed_income(),
        BUSINESS_PROOF,
        {
            "title": "Project-Specific Documents",
            "items": [
                "Detailed project report with cost & sales projections",
                "Sanctioned / approved building plans",
                "Clear, marketable land title documents",
                "Proof of developer's own contribution to the project",
            ],
        },
    ],
)

LOAN_AGAINST_SECURITIES = dict(
    title="Loan Against Securities",
    sections=[
        KYC_INDIVIDUAL,
        {
            "title": "Securities & Portfolio Documents",
            "items": [
                "Demat holding statement",
                "Portfolio / policy documents for the securities to be pledged",
                "Latest Consolidated Account Statement (CAS)",
                "*Confirmation that the securities are on the lender's approved list",
            ],
        },
    ],
)

LOAN_AGAINST_MUTUAL_FUNDS = dict(
    title="Loan Against Mutual Funds",
    sections=[
        KYC_INDIVIDUAL,
        {
            "title": "Mutual Fund Documents",
            "items": [
                "Latest mutual fund statement / Consolidated Account Statement (CAS)",
                "Folio details for the units to be pledged",
                "*Confirmation that the scheme is on the lender's approved AMC / fund list",
            ],
        },
    ],
)

PROFESSIONAL_LOAN = dict(
    title="Professional Loan",
    sections=[
        KYC_INDIVIDUAL,
        employment_income(4, title="Income — Salaried Professionals", note=None),
        self_employed_income(title="Income — Self-Employed / Own Practice", note=None),
        {
            "title": "Professional Registration Documents",
            "items": [
                "Professional registration / degree certificate (MBBS, CA, CS, architecture, etc.)",
                "Practice licence (if applicable)",
                "Clinic / office ownership or rent agreement, for a self-employed practice",
            ],
        },
    ],
)

# Generic Home Loan list (shown when a profile isn't picked) — same facts as the three full lists
HOME_LOAN_GENERIC = dict(
    title="Home Loan Checklist",
    subtitle="Pick the section that matches your profile, then check “For Every Applicant”. "
    "Choose Salaried, Self-Employed or NRI when downloading for the full list.",
    sections=[
        {
            "title": "Salaried",
            "items": [
                "Latest 4 months salary slips",
                "Latest 12 months salary and savings account statements",
                "Latest 2 years Form 16 (Part A & Part B) & Form 26AS",
                "ITR of last 2 years (if income is taxable)",
                "Employment proof — Company ID / Offer letter / Appointment letter "
                "(require 3 year continuity proof)",
            ],
        },
        {
            "title": "Self-Employed",
            "items": [
                "Latest 3 years ITRs, BS & P&L statements and Computation of Income, certified / audited by CA",
                "Latest 12 months business Current and Savings account bank statements",
                "Latest 2 years Form 26AS and latest 12 months GSTR 3B",
                "Business proof — Shop Act, Udyam, GST, Partnership Deed or MOA & AOA, as applicable",
            ],
        },
        {
            "title": "NRI",
            "items": [
                "Copy of valid Visa stamped on Passport & copy of employment contract",
                "Latest 6 months salary slips",
                "12 months bank statements of salary account and other active accounts, incl. NRE / NRO",
                "Resident Indian blood relative as co-applicant — PAN card & residence address proof",
                "Power of Attorney (POA), if the applicant can't be in India to sign the agreement",
            ],
        },
        {
            "title": "For Every Applicant",
            "items": [
                "KYC — Photo ID (PAN, Aadhaar, Passport) & address proof",
                "Property papers — agreement, title chain, tax receipts",
                "Passport size photographs of applicant & co-applicant",
            ],
        },
        {
            "title": "Basic Eligibility",
            "note": "Indicative starting points",
            "items": [
                "-Resident Indian, generally 23–65 years (up to around 70 for self-employed) at loan maturity",
                "-Salaried with take-home income from about Rs.25,000 per month, or self-employed with "
                "2–3 years of ITR",
                "-A CIBIL score near 700 gets the sharpest rate; lower scores are reviewed case by case, "
                "not auto-rejected",
            ],
        },
    ],
)

PRIVATE_FUNDING = dict(
    title="Private Funding",
    subtitle="Fast money when the clock is ticking.",
    sections=[
        {
            "title": "Documents You'll Need",
            "items": [
                "KYC — Photo ID (PAN, Aadhaar) & address proof",
                "Purpose note and repayment plan",
            ],
        },
        {
            "title": "Basic Eligibility",
            "items": [
                "-Self-employed, with turnover up to Rs.30 Cr",
                "-A credible, time-bound plan to repay or refinance",
            ],
        },
    ],
)

# filename (without -checklist.pdf) -> content
LOAN_CHECKLISTS = {
    "home-loan-salaried": HOME_LOAN_SALARIED,
    "home-loan-self-employed": HOME_LOAN_SELF_EMPLOYED,
    "home-loan-nri": HOME_LOAN_NRI,
    "home-loan": HOME_LOAN_GENERIC,
    "personal-loan": PERSONAL_LOAN,
    "car-loan": CAR_LOAN,
    "education-loan": EDUCATION_LOAN,
    "lap-dlod": LAP_DLOD,
    "wcl-cc-od-lc-bg": WCL_CC_OD_LC_BG,
    "balance-transfer": BALANCE_TRANSFER_PRODUCT,
    "business-loan": BUSINESS_LOAN,
    "cgtmse": CGTMSE,
    "lease-rental-discounting": LEASE_RENTAL,
    "unsecured-term-loan": UNSECURED_TERM_LOAN,
    "unsecured-dod": UNSECURED_DOD,
    "project-funding": PROJECT_FUNDING,
    "loan-against-securities": LOAN_AGAINST_SECURITIES,
    "loan-against-mutual-funds": LOAN_AGAINST_MUTUAL_FUNDS,
    "professional-loan": PROFESSIONAL_LOAN,
    "private-funding": PRIVATE_FUNDING,
}

# Products that share another product's list (they were identical files before, too)
COPIES = {
    "car-loan": ["car-refinance", "new-car-loan", "used-car-loan"],
    "lap-dlod": ["loan-against-property", "dlod"],
    "wcl-cc-od-lc-bg": [
        "bank-guarantee", "cash-credit", "letter-of-credit",
        "overdraft-limit", "working-capital", "working-capital-term-loan",
    ],
}
