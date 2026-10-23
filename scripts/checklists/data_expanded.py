"""Fuller checklists: Project Funding (from the construction-finance sheet), Loan Against Securities and
Private Funding. Imported by data_loans.py, which swaps them into LOAN_CHECKLISTS.

Same item syntax as data_loans.py: ' || ' for the Details column, '!' bold, '*' note, '-' bullet, '## ' sub-heading.
Benchmarks are the usual starting points lenders look at; each lender sets its own.
"""

KYC_FIRM = {
    "title": "KYC Documents",
    "note": "Applicant firm / company, and all Partners or Directors",
    "items": [
        "Photo ID — PAN card & Aadhaar card of every Partner / Director / Proprietor",
        "Address proof of each Partner / Director — latest electricity bill, passport, or rent agreement",
        "Permanent address proof || If current residence address is different",
        "Passport size photographs",
        "PAN card of the firm / company",
        "Certificate of Incorporation, Partnership Deed, or LLP Agreement",
        "Registered office and site office address proof",
    ],
}

# ── Project Funding (construction finance) ────────────────────────────────
PROJECT_FUNDING = dict(
    title="Project Funding",
    subtitle="Construction finance checklist for builders and developers.",
    sections=[
        {
            "callout": "<b>Benchmarks vary by lender.</b> The points in sections 1 and 2 are what construction "
            "finance lenders usually look at first. A project that misses one or two can still be reviewed, but "
            "it helps to know where you stand before you apply. Sections 3 to 7 are the papers to keep ready."
        },
        {
            "title": "Builder / Developer Profile",
            "note": "What lenders usually look for in the builder",
            "items": [
                "Projects completed to date || 8 to 10 or more",
                "Area delivered (possession handed over) || 5 lakh sq. ft. or more",
                "Experience in the real estate sector || 8 to 10 years or more",
                "Construction finance / term loan track record || Details of ongoing and closed loans",
                "Projects currently under execution || 2 or more",
                "Reference check || Positive, from reputed developers, financial institutions or property consultants",
            ],
        },
        {
            "title": "Proposed Residential Project",
            "note": "What lenders usually look for in the project",
            "items": [
                "Funding requirement || Minimum ₹5 Cr",
                "Ownership of the project land || Builder-owned, or joint venture",
                "Population of the city / town || More than 3 lakh, as per the last census",
                "Stage of construction || Above plinth level",
                "Units sold at the time of sanction || At least 10% of total units",
                "Average cost of units in the project || Average unit price",
                "Approval of the project || Municipal Corporation / Town Planning Authority",
                "Distance from the city centre and Municipal Corporation || Less than 50 km",
                "Distance from a National Highway || Less than 10 km",
                "Distance from the nearest railway station || Less than 10 km",
                "Builder's equity in the project || At least 50% of the proposed loan amount",
                "Websites || Builder's and project's web addresses",
            ],
        },
        KYC_FIRM,
        {
            "title": "Builder Financials & Business Proof",
            "items": [
                "Audited balance sheet, profit & loss account and CA reports || Last 3 years",
                "Income Tax Returns of the firm / company and of all Partners / Directors, with computation of income "
                "|| Last 3 years",
                "Form 26AS of the firm / company and of the Partners / Directors || Latest 2 years",
                "Bank statements of all current and savings accounts, including the RERA account || Last 12 months",
                "GST registration certificate and GSTR 3B returns || Last 12 months",
                "Memorandum & Articles of Association, or Partnership Deed, with the list of Directors / Partners "
                "and shareholding on letterhead, attested by CA",
                "Board resolution / partners' authority letter to borrow and create security",
                "Net worth statement of promoters, and CIBIL consent of the firm and promoters",
                "List of all completed and ongoing projects || Area, units, status, sales and funding",
                "Details of all existing loans — sanction letters and loan statements of account || If any",
                "Group company details and contingent liabilities, including guarantees given || If any",
            ],
        },
        {
            "title": "Project Documents",
            "items": [
                "Detailed project report || Cost, funding plan, sales and cash flow projections",
                "Approved building plans, Intimation of Disapproval (IOD) and Commencement Certificate",
                "RERA registration certificate and RERA quarterly updates",
                "Approvals / NOCs from authorities || Fire, environment, airport and others, as applicable",
                "Cost of the project and cost incurred to date || CA / engineer certificate",
                "Construction schedule and architect's / engineer's certificate of progress",
                "Proof of promoter's contribution (equity / margin) already put into the project",
                "Escrow / RERA account details and a statement of the account",
            ],
        },
        {
            "title": "Land & Title Documents",
            "items": [
                "Title deeds of the project land || Chain of title for the last 30 years",
                "7/12 extract / property card / city survey records and mutation entries",
                "Title search report and legal opinion on the land from an empanelled advocate",
                "Development Agreement / Joint Venture Agreement and Power of Attorney || If JV or development land",
                "Encumbrance certificate || Last 30 years",
                "NOC from existing lenders and release of charge || If the land is already mortgaged",
                "Latest property tax receipts and land revenue receipts",
            ],
        },
        {
            "title": "Sales Status",
            "items": [
                "Unit-wise sales statement || Booked, sold, unsold, and amount received",
                "Copies of allotment letters / agreements for sale of the units sold",
                "Pricing sheet and payment schedules || Average price per unit and per sq. ft.",
                "Customer collections in the RERA account || Statement of receipts",
                "Marketing and website details of the project",
            ],
        },
        {
            "title": "Fill In Your Details",
            "note": "Optional. Fill this in and we can tell you quickly where the project stands",
            "cols": 3,
            "form": [
                (
                    "Builder profile",
                    [
                        ("Number of projects completed till date", 1),
                        ("Area delivered till date (sq. ft.)", 1),
                        ("Years of experience in real estate", 1),
                        ("Projects currently under execution", 1),
                        ("Details of ongoing / closed CF or term loans", 2),
                        ("Details of reference checks done", 3),
                    ],
                ),
                (
                    "Project",
                    [
                        ("Construction finance needed (₹ Cr)", 1),
                        ("Land: builder-owned or joint venture", 1),
                        ("City / town and its population", 1),
                        ("Current stage of construction", 1),
                        ("Units sold / total units in the project", 1),
                        ("Average price per unit (₹)", 1),
                        ("Project approved by", 2),
                        ("Distance from Municipal Corporation (km)", 1),
                        ("Distance from National Highway (km)", 1),
                        ("Distance from railway station (km)", 1),
                        ("Builder's equity invested (₹ Cr)", 1),
                        ("Builder website", 1),
                        ("Project website", 1),
                    ],
                ),
            ],
        },
    ],
)

# ── Loan Against Securities ────────────────────────────────────────────────
LOAN_AGAINST_SECURITIES = dict(
    title="Loan Against Securities",
    subtitle="Documents to keep ready for an overdraft against your investments.",
    sections=[
        {
            "callout": "<b>What is needed depends on the size of the limit.</b> Up to Rs.1 Cr is a fully digital "
            "process. From Rs.1 Cr to Rs.3 Cr there is some paperwork as well, and no ITR is required. Above Rs.3 Cr "
            "the paper process applies and 3 years of ITR are required. Funding is up to 50% of the market "
            "value, on the lender's approved list."
        },
        {
            "title": "KYC Documents",
            "note": "Applicant, and Co-Applicant(s) if any",
            "items": [
                "Photo ID — PAN card & Aadhaar card",
                "Address proof — Aadhaar, passport, latest electricity bill or bank statement",
                "Permanent address proof || If current residence address is different",
                "Passport size photograph",
                "Cancelled cheque or bank account proof || For the account linked to the limit",
                "Mobile number and email ID linked to your Aadhaar, demat and mutual fund folios",
            ],
        },
        {
            "title": "Securities To Be Pledged",
            "note": "Securities must be on the lender's approved list",
            "items": [
                "Demat account holding statement || Latest, for stocks and ETFs",
                "Demat account details (DP ID and client ID), and the depository participant's details",
                "Consolidated Account Statement (CAS) from CAMS / KFintech || Latest",
                "Mutual fund folio numbers and statement || If pledging mutual funds",
                "Bond / debenture holding statement || If pledging bonds",
                "List of the securities, with quantity and ISIN, you want to pledge",
                "Pledge / lien marking confirmation through the depository or registrar",
            ],
        },
        {
            "title": "Income & Bank Details",
            "items": [
                "Latest bank statements || Last 6 months",
                "Income Tax Returns with computation of income || Last 3 years | Limits above ₹3 Cr",
                "Form 26AS || Latest 2 years | Limits above ₹3 Cr",
                "Salary slips, or business income proof || If the lender asks",
                "Details of existing loans and EMIs || If any",
            ],
        },
        {
            "title": "Promoter Funding",
            "note": "Only if promoters are pledging shares of their own company, subject to the approved company list",
            "items": [
                "Shareholding pattern of the company, with the promoters' holding and any shares already pledged",
                "Demat statements of the promoters showing the shares to be pledged",
                "Memorandum & Articles of Association, and the board resolution",
                "Latest annual report / audited financials of the company",
                "Disclosures made to the stock exchanges for the pledge || Where required",
                "Purpose of the funds and the repayment plan",
                "Company and promoter KYC",
            ],
        },
    ],
)

# ── Private Funding ────────────────────────────────────────────────────────
PRIVATE_FUNDING = dict(
    title="Private Funding",
    subtitle="Short-term business funding for self-employed applicants.",
    sections=[
        {
            "callout": "<b>For self-employed businesses only</b> (an individual, a partnership firm or a company). "
            "It is not for salaried individuals. The checklist is the same "
            "for an individual, a partnership firm and a company. Funding is generally for businesses with a "
            "turnover of Rs.20 Cr+ (Mumbai, Hyderabad, Bangalore, Chennai) or Rs.100 Cr+ (rest of India), as per "
            "lender policy."
        },
        {
            "title": "KYC Documents",
            "note": "Applicant, and all Partners or Directors",
            "items": [
                "Photo ID — PAN card & Aadhaar card",
                "Address proof — electricity bill, passport or rent agreement",
                "Passport size photographs",
                "PAN card of the firm / company",
            ],
        },
        {
            "title": "Income Documents",
            "note": "For businessman / self-employed",
            "items": [
                "ITRs, BS & P&L statements and Computation of Income (COI), duly certified / audited by a Chartered "
                "Accountant with UIDN — with full financials including 3CB & 3CD, Audit Report and all schedules "
                "|| Latest 3 years",
                "Business Current and Savings account bank statements (all existing loan EMI reflection account "
                "statements) || Latest 12 months",
                "Form 26AS || Latest 2 years",
                "GSTR 3B || Latest 12 months",
            ],
        },
        {
            "title": "Business Proof",
            "note": "As per your business type",
            "items": [
                "Shop Act licence, Udyam registration certificate, GST registration certificate || tag:Proprietor",
                "PAN card, registered Partnership Deed, list of Partners & shareholding pattern on company letterhead "
                "duly attested by CA, Shop Act licence, Udyam registration certificate, GST registration certificate "
                "|| tag:Partnership firm",
                "PAN card, Memorandum & Articles of Association (MOA & AOA) / Resolution, list of Directors & "
                "Shareholders on company letterhead duly attested by CA, Certificate of Incorporation, Shop Act "
                "licence, Udyam registration certificate, GST registration certificate || tag:Pvt Ltd company",
            ],
        },
        {
            "title": "Business Details",
            "note": "Party-wise and promoter information",
            "items": [
                "Top 5 customers and top 5 suppliers — party-wise details",
                "Latest order copies",
                "Company profile — brief profile and background of the promoters",
                "Loan end-use details",
                "Debtors ageing, party-wise || Last and current financial year",
            ],
        },
        {
            "title": "Existing Loans & Net Worth",
            "items": [
                "!All loan sanction letters & Loan SOA (EMI obligation & details sheet) || In case of any existing loan",
                "CA attested Net worth certificate",
            ],
        },
        {
            "title": "Funding Details",
            "items": [
                "Purpose of the funds and the amount needed",
                "Repayment plan and the source of repayment",
                "Post-dated cheques (PDCs) as security || As per the lender's structure",
                "Signed consent for a credit check",
            ],
        },
    ],
)
