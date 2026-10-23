"""Detailed CA & legal service checklists: slug -> list of sections.

Replaces the 2 to 4 line lists in data_ca_legal.py for the downloadable PDF. Services whose full groups
already come from professional-services.ts (income-tax-return-filing) are not listed here.
The exact papers always depend on the case; the associated professional confirms them.
"""

ID_BLOCK = lambda who="Applicant": {
    "title": f"Identity & Address — {who}",
    "items": [
        "PAN card",
        "Aadhaar card",
        "Passport size photograph",
        "Address proof — latest electricity bill, passport or bank statement",
        "Mobile number and email ID",
    ],
}

DETAIL = {
    "tax-planning-advisory": [
        ID_BLOCK("Taxpayer"),
        {
            "title": "Income Details",
            "items": [
                "Form 16 and salary slips || Latest financial year",
                "Latest Income Tax Return and computation || Last 2 years",
                "Form 26AS / AIS / TIS from the income tax portal",
                "Business income, profit & loss and balance sheet || If self-employed",
                "Rent, interest, dividend and capital gains statements || If any",
            ],
        },
        {
            "title": "Existing Investments & Insurance",
            "items": [
                "Life, health and term insurance policies and premium receipts",
                "PPF, EPF, NPS, ELSS, tax-saving FD and other investment statements",
                "Home loan interest and principal certificate || If any",
                "Mutual fund, shares and demat statements",
                "Property details and rent received || If any",
            ],
        },
        {
            "title": "Goals & Liabilities",
            "items": [
                "Tax-saving goals and planned investments for the year",
                "Details of loans and EMIs",
                "Donations and other deduction proofs || If any",
            ],
        },
    ],
    "tds-return-filing": [
        {
            "title": "Deductor Details",
            "items": [
                "TAN allotment letter and TAN number",
                "PAN of the deductor (company, firm or individual)",
                "TRACES and income tax portal login details",
                "Name and address of the responsible person",
            ],
        },
        {
            "title": "Deduction Records For The Quarter",
            "items": [
                "Party-wise list of payments on which tax was deducted || Name, PAN, amount, date",
                "Nature of payment and section of deduction || Salary, contractor, rent, professional fees and so on",
                "Rate of TDS applied and the tax deducted",
                "Salary register, Form 12BB and investment declarations || For salary TDS",
                "Lower or nil deduction certificates received || If any",
            ],
        },
        {
            "title": "Payment & Filing Records",
            "items": [
                "Challans paid || CIN, BSR code, date and amount",
                "Previous quarter returns and their provisional receipt numbers",
                "Notices, defaults or correction statements from TRACES || If any",
                "Form 16 / 16A issued earlier || For reference",
            ],
        },
    ],
    "tds-property-sale-26qb": [
        {
            "title": "Buyer & Seller Details",
            "items": [
                "PAN card of the buyer and of every seller",
                "Aadhaar card, address, mobile number and email of the buyer and the seller",
                "Share of each buyer and each seller || If there are more than one",
            ],
        },
        {
            "title": "Property & Payment Details",
            "items": [
                "Agreement for sale / sale deed || Registered or draft",
                "Address and description of the property",
                "Total sale consideration and the stamp duty value",
                "Date of the agreement, and dates and amounts of each payment",
                "Bank account details to pay the tax",
            ],
        },
        {
            "title": "Tax Details",
            "items": [
                "TDS rate and amount to be deducted || 1% where the consideration is ₹50 lakh or more",
                "Lower deduction certificate || If the seller has one",
                "Challan after payment, and Form 16B to give to the seller",
                "Non-resident seller details and certificates || If the seller is an NRI",
            ],
        },
    ],
    "gst-registration": [
        {
            "title": "Identity Of The Business Owner(s)",
            "note": "Proprietor, all Partners or Directors, and the authorised signatory",
            "items": [
                "PAN card and Aadhaar card",
                "Passport size photograph",
                "Address proof of each Partner / Director",
                "Mobile number and email ID, one for each person",
                "Digital Signature Certificate || For a company or LLP",
            ],
        },
        {
            "title": "Business Constitution Proof",
            "items": [
                "PAN card of the business",
                "Partnership Deed || For a firm",
                "Certificate of Incorporation, MOA & AOA || For a company",
                "LLP Agreement and Certificate of Incorporation || For an LLP",
                "Authorisation letter or board resolution for the signatory",
            ],
        },
        {
            "title": "Place Of Business",
            "items": [
                "Electricity bill or property tax receipt of the principal place of business",
                "Rent agreement and the owner's NOC || If rented",
                "Details of any additional places of business",
            ],
        },
        {
            "title": "Bank & Business Details",
            "items": [
                "Cancelled cheque or bank statement first page",
                "Nature of business, goods and services dealt in, and their HSN / SAC codes",
                "Date the business started, and the expected turnover",
            ],
        },
    ],
    "gst-return-filing": [
        {
            "title": "Access",
            "items": [
                "GST portal login details || User ID and password, or authorisation to our team",
                "GSTIN and registration details",
            ],
        },
        {
            "title": "Sales Records",
            "items": [
                "Sales invoices for the month || B2B and B2C",
                "Credit notes and debit notes issued",
                "E-way bills and e-invoice (IRN) details || If applicable",
                "Export invoices and Letter of Undertaking || If you export",
            ],
        },
        {
            "title": "Purchase Records & Input Tax Credit",
            "items": [
                "Purchase invoices and expense bills for the month",
                "GSTR 2B downloaded for the month, for matching",
                "Bills with reverse charge || If any",
                "Credit notes received from suppliers",
            ],
        },
        {
            "title": "Payments & Past Returns",
            "items": [
                "Bank statements for the month || To match receipts and payments",
                "Cash and credit ledger balances, and challans of GST paid",
                "Returns filed earlier, and any notices received",
            ],
        },
    ],
    "gst-reconciliation-notice-support": [
        {
            "title": "Returns & Ledgers",
            "items": [
                "GSTR 1, GSTR 3B, GSTR 9 and GSTR 9C filed || Financial year(s) concerned",
                "GSTR 2A and 2B for the period",
                "Electronic cash ledger, credit ledger and liability ledger",
                "Challans of tax paid",
            ],
        },
        {
            "title": "Books & Records",
            "items": [
                "Books of accounts, sales and purchase registers",
                "Sales and purchase invoices queried || With e-way bills / e-invoice details",
                "Bank statements and stock statements",
                "Credit and debit notes",
            ],
        },
        {
            "title": "Notice Details",
            "items": [
                "Copy of the notice, order or intimation || Form number, date and due date to reply",
                "Replies and documents already submitted || If any",
                "Earlier correspondence with the GST department",
                "Hearing date and the officer's details || If given",
            ],
        },
    ],
    "accounting-bookkeeping": [
        {
            "title": "Banking",
            "items": [
                "Bank statements of all accounts || Every month",
                "Credit card and loan account statements",
                "Cash book and petty cash records",
            ],
        },
        {
            "title": "Sales & Purchases",
            "items": [
                "Sales invoices, including credit notes",
                "Purchase bills and debit notes",
                "Debtors and creditors lists with ageing",
                "Stock / inventory details || Opening and closing",
            ],
        },
        {
            "title": "Expenses & Payroll",
            "items": [
                "Expense vouchers and bills || Rent, utilities, travel and others",
                "Salary and payroll records, PF and ESIC details",
                "Fixed asset purchase invoices and the asset register",
            ],
        },
        {
            "title": "Statutory & Past Records",
            "items": [
                "GST and TDS returns and challans",
                "Previous year's financial statements and trial balance",
                "Accounting software data or backup || Tally, Zoho, QuickBooks or others",
            ],
        },
    ],
    "tax-audit-support": [
        {
            "title": "Books & Financials",
            "items": [
                "Complete books of accounts, ledgers and trial balance",
                "Draft balance sheet and profit & loss account",
                "Bank statements of all accounts || Full financial year",
                "Previous year's audit report, financials and tax audit forms",
            ],
        },
        {
            "title": "Records For Audit Checks",
            "items": [
                "Fixed asset register and depreciation schedule",
                "Stock statement and valuation",
                "Loan statements and confirmations || Banks, lenders and directors",
                "Debtors and creditors lists, with confirmations",
                "Cash payments above the limits and details of loans and deposits taken or repaid in cash",
                "Details of related-party transactions",
            ],
        },
        {
            "title": "Statutory Compliance",
            "items": [
                "GST returns and reconciliation with books",
                "TDS returns, challans and Form 26AS",
                "PF, ESIC and other statutory payments",
                "Turnover details and the Income Tax Return of the previous year",
            ],
        },
    ],
    "company-llp-registration": [
        ID_BLOCK("Each Director / Partner"),
        {
            "title": "Directors / Partners — More Details",
            "items": [
                "Bank statement or utility bill as address proof || Not older than 2 months",
                "Digital Signature Certificate (DSC)",
                "Director Identification Number (DIN) || If already held",
                "Passport and apostilled documents || For foreign nationals",
                "Consent and declarations signed by each Director / Partner",
            ],
        },
        {
            "title": "Registered Office",
            "items": [
                "Electricity bill or property tax receipt of the office",
                "Rent agreement and the owner's NOC || If rented",
                "Owner's ownership proof || Sale deed or tax receipt",
            ],
        },
        {
            "title": "Company / LLP Details",
            "items": [
                "2 to 3 proposed names, in order of preference",
                "Main business activity and objects",
                "Share capital and each member's shareholding || For a company",
                "LLP agreement terms and capital contribution of each partner || For an LLP",
                "Nominee details of each Director / Partner || For a company",
            ],
        },
    ],
    "msme-udyam-registration": [
        {
            "title": "Owner's Details",
            "items": [
                "Aadhaar number of the proprietor, partner, director or authorised signatory",
                "PAN card of the owner and of the business",
                "Mobile number and email ID linked to Aadhaar",
                "Social category and gender || For reports and benefits",
            ],
        },
        {
            "title": "Business Details",
            "items": [
                "GSTIN || If registered",
                "Business name, type (proprietor, firm, company) and date it started",
                "Registered office and plant / unit address",
                "Main business activity and NIC code(s)",
            ],
        },
        {
            "title": "Investment, Turnover & Bank",
            "items": [
                "Investment in plant and machinery or equipment || Details",
                "Annual turnover || As per ITR or GST returns",
                "Number of employees",
                "Bank account number and IFSC",
                "Earlier MSME registration (UAM) or EM-II number || If any",
            ],
        },
    ],
    "shop-act-fssai-registration": [
        ID_BLOCK("Owner / Proprietor"),
        {
            "title": "Shop & Establishment Registration",
            "items": [
                "Shop / office address proof || Ownership paper, or rent agreement with the owner's NOC",
                "Electricity bill and property tax receipt",
                "Number of employees and their details",
                "Partnership Deed or Certificate of Incorporation || If a firm or company",
                "Photograph of the shop with the name board",
            ],
        },
        {
            "title": "FSSAI Food Licence / Registration",
            "note": "Only if you deal in food",
            "items": [
                "List of food products you make, sell or store",
                "Business address proof, and the NOC from the owner if rented",
                "Photo ID of the proprietor / authorised person",
                "Partnership Deed or MOA & AOA, and the list of Directors || For a firm or company",
                "Layout plan and list of equipment || For manufacturing or processing",
                "Water test report || For manufacturing or processing",
                "Annual turnover or production capacity",
                "Food safety management plan || For a licence",
            ],
        },
    ],
    "pan-tan-dsc-services": [
        {
            "title": "PAN Application",
            "items": [
                "Aadhaar card and a second photo ID",
                "Proof of date of birth",
                "Address proof",
                "Passport size photograph and signature",
                "Certificate of incorporation or Partnership Deed || For a firm or company",
                "Authorised signatory's details || For a firm or company",
            ],
        },
        {
            "title": "TAN Application",
            "items": [
                "Name, PAN and address of the deductor",
                "Details of the person responsible for deducting tax",
                "Certificate of incorporation or Partnership Deed || For a firm or company",
            ],
        },
        {
            "title": "Digital Signature Certificate (DSC)",
            "items": [
                "PAN card and Aadhaar card",
                "Passport size photograph",
                "Email ID and mobile number",
                "Organisation proof and authorisation letter || For an organisation DSC",
                "Aadhaar-linked mobile number for e-KYC",
            ],
        },
    ],
    "property-title-verification": [
        {
            "title": "Core Ownership & Title Documents",
            "items": [
                "Original registered Sale Deed, Conveyance Deed or other ownership document",
                "Previous title deeds and chain of ownership documents, where required",
                "Latest Index II",
                "Latest Property Card / 7/12 Extract / 8A Extract, as applicable",
                "Latest mutation entries and supporting orders, if applicable",
                "Latest property tax bill and paid receipts",
                "Complete property details, including area, address, CTS / Survey / Gat number, as applicable",
                "Details of mortgages, loans, encumbrances, litigation or third-party claims, if any",
                "Power of Attorney, if applicable",
            ],
        },
        {
            "title": "Owner / Seller Details",
            "items": [
                "KYC of all the owners || PAN card, Aadhaar card, address proof",
                "Legal heir certificate and death certificate || If the property was inherited",
                "Registration receipts of the earlier deeds",
            ],
        },
        {
            "title": "Flat / Building Papers",
            "items": [
                "Agreement for sale, allotment letter and possession letter",
                "Society share certificate and NOC || For a society flat",
                "Approved plans, Commencement Certificate, Occupancy Certificate",
                "RERA registration certificate || For new projects",
                "Electricity and maintenance bills",
            ],
        },
        {
            "title": "Other Checks",
            "items": [
                "Encumbrance certificate || Last 30 years",
                "NOC and loan closure papers from any bank || If the property was mortgaged",
                "Court orders or litigation details || If any",
                "Development Agreement || If any",
            ],
        },
    ],
    "sale-agreement-sale-deed": [
        {
            "title": "Buyer & Seller",
            "items": [
                "PAN card and Aadhaar card of every buyer and seller",
                "Address proof and passport size photographs",
                "Power of Attorney || If someone signs on behalf of a party",
                "Marital status, and consent of the spouse or co-owners || As applicable",
            ],
        },
        {
            "title": "Property & Title Papers",
            "items": [
                "Details of the property || Address, area, survey / CTS number",
                "Previous deeds and the chain of title",
                "Society share certificate, NOC and no-dues certificate || For a society flat",
                "Latest property tax receipt, electricity and maintenance bills",
                "Bank NOC and loan closure papers || If mortgaged",
                "Builder papers || Allotment letter, RERA, Occupancy Certificate, for a new flat",
            ],
        },
        {
            "title": "Deal Terms",
            "items": [
                "Sale price, token amount and payment schedule",
                "Possession date, and who bears which expenses",
                "Bank sanction letter || If the buyer takes a loan",
            ],
        },
        {
            "title": "Stamp Duty, Registration & Tax",
            "items": [
                "Stamp duty and registration fee || Value as per the ready reckoner",
                "Two witnesses with ID proof",
                "Form 26QB and TDS challan || If the consideration is ₹50 lakh or more",
            ],
        },
    ],
    "gift-release-deed": [
        {
            "title": "Parties",
            "items": [
                "PAN card and Aadhaar card of the donor / releasor and the donee / releasee",
                "Address proof and passport size photographs",
                "Proof of the relationship || Birth certificate, family tree or Aadhaar",
            ],
        },
        {
            "title": "Property Papers",
            "items": [
                "Title deeds and the chain of title",
                "7/12 extract, property card, or the flat's share certificate and society NOC",
                "Latest property tax receipt and electricity bill",
                "Valuation of the property || Stamp duty value as per the ready reckoner",
                "Bank NOC || If the property is mortgaged",
            ],
        },
        {
            "title": "For A Release Deed",
            "items": [
                "Death certificate of the earlier owner",
                "Legal heir certificate or succession certificate",
                "Consent of every legal heir who is giving up their share",
                "Will or family settlement || If any",
            ],
        },
        {
            "title": "Execution",
            "items": [
                "Two witnesses with ID proof",
                "Stamp duty and registration fee",
            ],
        },
    ],
    "power-of-attorney-drafting": [
        {
            "title": "Parties",
            "items": [
                "PAN card and Aadhaar card of the person giving the power and of the agent",
                "Address proof and passport size photographs of both",
                "Relationship between them",
            ],
        },
        {
            "title": "Powers & Purpose",
            "items": [
                "Purpose || General, or for a specific property, bank, court case or business",
                "List of the powers to be given",
                "How long it should last, and whether it can be cancelled",
                "Property documents and details || If it is about a property",
            ],
        },
        {
            "title": "For A Person Living Abroad",
            "items": [
                "Passport, visa or OCI card",
                "Overseas address proof",
                "Notarisation or apostille of the signed paper || As required, before it is used in India",
            ],
        },
        {
            "title": "Execution",
            "items": [
                "Two witnesses with ID proof",
                "Stamp duty paper, and registration || If required for the powers given",
            ],
        },
    ],
    "society-share-transfer": [
        {
            "title": "Seller & Buyer",
            "items": [
                "PAN card, Aadhaar card, address proof and photographs of both",
                "Membership application form of the buyer, as per the society's bye-laws",
                "Undertaking and indemnity bond by the buyer",
            ],
        },
        {
            "title": "Flat & Society Papers",
            "items": [
                "Original share certificate of the seller",
                "Agreement for sale and the registered chain of title",
                "Society NOC for the transfer || Receipt of the transfer fee / premium",
                "Maintenance dues clearance certificate",
                "Society's registration certificate and bye-laws",
                "Latest maintenance bill and property tax receipt",
            ],
        },
        {
            "title": "In Special Cases",
            "items": [
                "Death certificate and legal heir documents || If the member has passed away",
                "Bank NOC || If the flat is mortgaged",
                "Will or nomination papers || If it is a transfer by inheritance",
            ],
        },
        {
            "title": "Stamp Duty & Registration",
            "items": [
                "Stamp duty on the agreement and its registration",
                "Society's resolution admitting the buyer as a member",
            ],
        },
    ],
    "society-noc-membership": [
        {
            "title": "Applicant",
            "items": [
                "PAN card, Aadhaar card and address proof",
                "Passport size photographs",
                "Application letter to the society, stating the purpose || Sale, loan, renovation, letting or others",
            ],
        },
        {
            "title": "Flat Papers",
            "items": [
                "Agreement for sale and share certificate",
                "Allotment or possession letter",
                "Latest maintenance bill and no-dues certificate",
                "Property tax receipt",
            ],
        },
        {
            "title": "For New Membership",
            "items": [
                "Membership application and entrance fee receipt",
                "Share certificate or share transfer papers",
                "Affidavit and indemnity bond as required by the society",
                "Society's resolution approving the membership",
            ],
        },
    ],
    "sra-flat-transfer": [
        {
            "title": "Parties",
            "items": [
                "PAN card, Aadhaar card, address proof and photographs of the transferor and the transferee",
                "Income and other proof of the transferee || As the authority asks",
                "Photo pass or ID card of the original allottee",
            ],
        },
        {
            "title": "SRA Documents",
            "items": [
                "Copy of Annexure II issued or certified by the competent authority.",
                "Copy of the SRA Allotment Letter / Ownership Letter.",
                "Copy of the Society Share Certificate.",
                "Aadhaar Card of the existing holder.",
                "Aadhaar Card of the spouse, where applicable.",
                "Photographs, allotment records or other records relating to the rehabilitation allotment, as applicable.",
                "Copy of the possession letter or other possession record, if available.",
                "Copy of the original rehabilitation agreement or other relevant allotment documents, if available.",
                "Details of the SRA scheme, building, flat number and allotment date.",
                "Details of any previous transfer, mortgage, litigation or restriction affecting the tenement.",
                "Proof that the lock-in period under the rules has ended",
            ],
        },
        {
            "title": "Permissions & Dues",
            "items": [
                "NOC from the society and the developer",
                "SRA permission for the transfer, and the transfer fee challan",
                "Dues cleared || Maintenance, property tax and electricity",
                "Indemnity bond and affidavits",
            ],
        },
        {
            "title": "Agreement & Registration",
            "items": [
                "Agreement for sale, with stamp duty and registration",
                "Two witnesses with ID proof",
            ],
        },
    ],
    "mhada-flat-transfer": [
        {
            "title": "Parties",
            "items": [
                "PAN card, Aadhaar card, address proof and photographs of the seller and the buyer",
                "Income proof of the buyer || If required by MHADA's rules",
            ],
        },
        {
            "title": "MHADA Papers",
            "items": [
                "Allotment letter, possession letter and the lease deed / agreement",
                "MHADA's permission (NOC) for the transfer, and the fee receipt",
                "Society share certificate and society NOC",
                "Proof that any lock-in period has ended",
            ],
        },
        {
            "title": "Dues & Deed",
            "items": [
                "No-dues from MHADA, the society, and for tax and electricity",
                "Indemnity bond and affidavits",
                "Agreement for sale, with stamp duty and registration",
                "Two witnesses with ID proof",
            ],
        },
    ],
    "mmrda-property-documentation": [
        {
            "title": "Parties",
            "items": [
                "PAN card, Aadhaar card, address proof and photographs of the seller and the buyer",
                "Authorisation papers || If someone signs on behalf of a party",
            ],
        },
        {
            "title": "MMRDA Papers",
            "items": [
                "Allotment letter and the agreement / lease with MMRDA",
                "Possession letter and Occupancy Certificate",
                "MMRDA's permission (NOC) for the transfer, and its fee receipt",
                "Society or association NOC and share certificate || If any",
            ],
        },
        {
            "title": "Dues & Registration",
            "items": [
                "Property tax, maintenance and electricity dues cleared",
                "Bank NOC || If mortgaged",
                "Agreement for sale, with stamp duty and registration",
                "Two witnesses with ID proof",
            ],
        },
    ],
    "society-redevelopment-documentation": [
        {
            "title": "Society Papers",
            "items": [
                "Society's registration certificate and bye-laws",
                "List of members, with their flat numbers and area",
                "General body resolutions || Redevelopment, developer and consultant, passed by the required majority",
                "Structural audit report || Showing the need for redevelopment",
                "Society's bank details, and audited accounts of the last 3 years",
            ],
        },
        {
            "title": "Land & Building Documents",
            "items": [
                "Original land title documents and previous conveyance deeds.",
                "Latest Property Card / 7/12 Extract and relevant mutation entries.",
                "City Survey records, CTS number, survey plan and land measurement records, as applicable.",
                "Development Agreement or Lease Deed, if the land is leasehold or subject to development rights.",
                "Existing building's sanctioned plan and available commencement and occupancy certificates.",
                "Existing building's approved layout, completion records and other municipal approvals.",
                "Property tax bills, land revenue receipts and other relevant dues records.",
                "Documents relating to reservations, easements, mortgages, litigation or third-party claims affecting the land.",
                "Deemed conveyance application and supporting records, if conveyance has not been completed.",
                "NOCs from the authority, MHADA or the lessor || As applicable",
            ],
        },
        {
            "title": "Developer & Consultant",
            "items": [
                "Appointment letter of the project management consultant and the architect",
                "Developer selection papers || Tender, proposals and resolution",
                "Developer's KYC, RERA registration and financial details",
                "Draft Development Agreement and Power of Attorney",
            ],
        },
        {
            "title": "Members' Papers",
            "items": [
                "Each member's consent and individual agreement || Permanent alternate accommodation",
                "Each member's KYC and share certificate",
                "Details of the rent or transit accommodation and the corpus fund",
            ],
        },
    ],
    "legal-drafting-agreements-affidavits": [
        {
            "title": "Parties",
            "items": [
                "Full names, PAN card, Aadhaar card and addresses of all the parties",
                "Entity papers || Certificate of Incorporation or Partnership Deed, for a firm or company",
                "Authorisation letter or board resolution of the person signing",
            ],
        },
        {
            "title": "What Is To Be Drafted",
            "items": [
                "The kind of document || Rent, leave and licence, loan, partnership, service, NDA, affidavit, indemnity and others",
                "Main terms || Price or rent, deposit, period, payment dates, duties of each side",
                "Any draft, earlier agreement or term sheet",
                "Special conditions you want to add",
            ],
        },
        {
            "title": "Supporting Papers",
            "items": [
                "Property or business papers the document refers to",
                "Earlier correspondence or notices || For a notice or reply",
                "Facts and dates for an affidavit, and the deponent's ID",
            ],
        },
        {
            "title": "Execution",
            "items": [
                "Stamp duty or e-stamp paper, and notarisation / registration as required",
                "Two witnesses with ID proof",
            ],
        },
    ],
    "public-notice-publication": [
        {
            "title": "Client Details",
            "items": [
                "PAN card, Aadhaar card and address proof of the client",
                "Authorisation letter || If an advocate or company is giving the instruction",
                "Contact details for objections, and the date by which to reply",
            ],
        },
        {
            "title": "Notice Details",
            "items": [
                "Purpose of the notice || Property, name change, lost documents, and others",
                "Draft or full facts of the notice",
                "Property or document details || Address, survey / CTS number, owners",
                "Title papers or proof supporting the notice",
            ],
        },
        {
            "title": "Publication Details",
            "items": [
                "Newspapers, language and editions to publish in",
                "Date or dates of publication",
                "Invoice details for the advertisement charges",
                "Copies of the earlier notice || If this is a repeat notice",
            ],
        },
    ],
    "nri-property-documentation": [
        {
            "title": "Common Documents Required From The NRI",
            "items": [
                "Valid Passport.",
                "Overseas address proof.",
                "Indian address proof, if available or required.",
                "PAN Card.",
                "Recent passport-size photographs, if required.",
                "Overseas residence permit, visa or other residency-status evidence, where applicable.",
                "NRI status and tax-residency details, as relevant to the transaction.",
            ],
        },
        {
            "title": "Power Of Attorney",
            "note": "If a family member or representative acts for you in India",
            "items": [
                "Power of Attorney signed abroad, notarised and apostilled or attested by the Indian Embassy",
                "KYC of the attorney holder",
                "Registration and stamp duty on the Power of Attorney in India",
            ],
        },
        {
            "title": "Property Papers",
            "items": [
                "Title deeds, agreement for sale or the sale deed",
                "Society NOC and share certificate || For a flat",
                "Property tax, electricity and maintenance bills",
                "Encumbrance certificate",
            ],
        },
        {
            "title": "Banking & Tax",
            "items": [
                "NRE / NRO account details and statements",
                "Tax residency and PAN details || For tax and TDS on a sale",
                "Lower tax deduction certificate || If applied for",
                "Forms for sending sale money abroad || If repatriating",
            ],
        },
    ],
    "will-succession-documentation": [
        {
            "title": "Person Making The Will (Testator)",
            "items": [
                "PAN card, Aadhaar card, address proof and photographs",
                "Date of birth and family details || Spouse, children, parents",
                "Medical certificate of mental fitness || If the age or health makes it advisable",
            ],
        },
        {
            "title": "Assets To Be Covered",
            "items": [
                "Property papers || Title deeds, flat share certificate, 7/12 extract",
                "Bank accounts, fixed deposits, demat and mutual fund statements",
                "Insurance policies, PPF / EPF / NPS and other nominations",
                "Business, vehicle, jewellery and other asset details",
            ],
        },
        {
            "title": "Beneficiaries & Executors",
            "items": [
                "Names, relationships and addresses of all beneficiaries, and who gets what",
                "Executor's name and contact details",
                "Two witnesses with ID proof",
                "Earlier will, if it is to be replaced",
            ],
        },
        {
            "title": "After A Death (Succession)",
            "items": [
                "Death certificate",
                "Legal heir certificate, or succession certificate / probate from the court",
                "Family tree and NOC or release deeds from the other legal heirs",
                "Will || If there is one",
                "Property papers, mutation entries and bank / demat transmission forms",
            ],
        },
    ],
}
