// The step-by-step guide shown on each loan page. Written per loan so the steps match what that loan
// really involves. A loan without an entry here falls back to the general steps on the page.

export type ProcessStep = { title: string; body: string };

export type LoanProcess = { intro: string; steps: ProcessStep[] };

const s = (title: string, body: string): ProcessStep => ({ title, body });

export const LOAN_PROCESS: Record<string, LoanProcess> = {
  "home-loan": {
    intro:
      "Buying or building a home is simpler when you know what comes next. Here is how a home loan moves with us.",
    steps: [
      s(
        "Share your plan",
        "Tell us the property, your income and the amount you have in mind. We check what you may be eligible for.",
      ),
      s(
        "Pick a lender",
        "We compare offers from banks and NBFCs on rate, fees and terms, and you choose the one that suits you.",
      ),
      s(
        "Submit documents",
        "You hand over KYC, income proof and property papers. We prepare the file the way the lender expects.",
      ),
      s(
        "Property check and sanction",
        "The lender verifies the property and your profile, then issues the sanction letter.",
      ),
      s(
        "Agreement and disbursal",
        "You sign the loan agreement, and the lender releases the money to the seller or builder.",
      ),
    ],
  },
  "loan-against-property": {
    intro:
      "A loan against property depends on the property as much as on you. Here is the path from first call to funds.",
    steps: [
      s(
        "Tell us about the property",
        "Share the property type, its location and how you plan to use the money.",
      ),
      s(
        "Estimate and shortlist",
        "We estimate how much it can fetch and shortlist lenders who lend on that type of property.",
      ),
      s(
        "Documents and title papers",
        "You provide KYC, income proof and the ownership papers for the property.",
      ),
      s(
        "Valuation and legal check",
        "The lender values the property and its lawyers check that the title is clear.",
      ),
      s(
        "Sanction and disbursal",
        "After the sanction and the signing, the loan amount is credited to your account.",
      ),
    ],
  },
  "lease-rental-discounting": {
    intro:
      "Lease rental discounting turns future rent into money today. Here is how the loan is set up.",
    steps: [
      s(
        "Share the lease details",
        "Tell us about the property, the tenant, the lease terms and the rent you receive.",
      ),
      s(
        "Check the rental income",
        "We review the lease agreement, the tenant's standing and your rent record.",
      ),
      s(
        "Match a lender",
        "We approach lenders who finance rentals from this kind of tenant and property.",
      ),
      s(
        "Legal and valuation checks",
        "The lender checks the property title and its value, and may verify the lease with the tenant.",
      ),
      s(
        "Sanction and disbursal",
        "Once the rent is assigned to the lender, the amount is released.",
      ),
    ],
  },
  "balance-transfer": {
    intro:
      "Moving your loan only makes sense if you save. Here is how we check that and carry out the switch.",
    steps: [
      s(
        "Share your current loan",
        "Give us your outstanding amount, rate, remaining tenure and a recent loan statement.",
      ),
      s(
        "Compare real savings",
        "We set other lenders' offers beside your loan, counting every fee, so you see the true saving.",
      ),
      s(
        "Apply with the new lender",
        "If you decide to switch, we prepare your documents and file the new application.",
      ),
      s(
        "Closure at the old lender",
        "The new lender pays off your old loan, and your original property papers move across.",
      ),
      s(
        "Top-up and new EMI",
        "If you need extra funds, a top-up may be added. Your new EMI then begins.",
      ),
    ],
  },
  dlod: {
    intro:
      "A drop-line overdraft gives you a limit that reduces over time. Here is how it is arranged.",
    steps: [
      s(
        "Tell us your need",
        "Share how much cash cushion you want and what property you can offer as security.",
      ),
      s(
        "Property and limit check",
        "We estimate the limit your property can support and shortlist lenders.",
      ),
      s(
        "Documents and valuation",
        "You provide business and property papers, and the lender values the property.",
      ),
      s(
        "Sanction and set-up",
        "The lender sets the limit and the schedule by which it steps down.",
      ),
      s(
        "Use and repay",
        "You draw what you need within the limit and pay interest on the amount used.",
      ),
    ],
  },
  "business-loan": {
    intro:
      "A business loan is decided mostly on your business records. Here is how we get you from need to funds.",
    steps: [
      s(
        "Tell us about the business",
        "Share what the business does, how long it has run and what you need the money for.",
      ),
      s(
        "Review your numbers",
        "We look at your turnover, GST returns and bank statements to see what a lender will offer.",
      ),
      s(
        "Choose the lender",
        "We shortlist lenders whose terms suit your business and compare their offers.",
      ),
      s(
        "Submit the file",
        "You provide KYC, business proof and statements, and we present them cleanly.",
      ),
      s(
        "Sanction and disbursal",
        "After the lender's review, the amount is released to your business account.",
      ),
    ],
  },
  cgtmse: {
    intro:
      "CGTMSE cover lets eligible businesses borrow without giving collateral. Here is how it works.",
    steps: [
      s(
        "Check eligibility",
        "We see whether your business and the loan purpose qualify for the guarantee cover.",
      ),
      s(
        "Choose a participating lender",
        "We approach banks and lenders who offer loans under the CGTMSE scheme.",
      ),
      s(
        "Prepare the application",
        "You provide business documents, financials and a short note on how the money will be used.",
      ),
      s(
        "Lender review and guarantee",
        "The lender reviews the file and places the guarantee cover for your loan.",
      ),
      s(
        "Sanction and disbursal",
        "The loan is sanctioned without collateral, and the funds reach your account.",
      ),
    ],
  },
  "unsecured-term-loan": {
    intro:
      "An unsecured term loan needs no security, so the lender looks closely at your business and credit. Here is the path.",
    steps: [
      s(
        "Tell us your requirement",
        "Share the amount, the purpose and how long you would like to repay.",
      ),
      s(
        "Credit and cash-flow check",
        "We review your credit record and bank statements to see which lenders will fit.",
      ),
      s("Compare offers", "You see the rate, fees and EMI from each lender side by side."),
      s(
        "Documents and approval",
        "You submit KYC and business proof. The lender reviews and approves.",
      ),
      s("Disbursal and fixed EMIs", "The funds are credited and you repay in fixed monthly EMIs."),
    ],
  },
  "unsecured-dod": {
    intro:
      "An unsecured drop-down overdraft is standby cash with no EMI until you use it. Here is how it is set up.",
    steps: [
      s("Share your need", "Tell us how much standby cash your business wants."),
      s(
        "Check your accounts",
        "We review your banking and credit record to see what limit is realistic.",
      ),
      s("Match a lender", "We shortlist lenders who offer this facility to businesses like yours."),
      s(
        "Documents and sanction",
        "You submit KYC and business papers, and the lender sanctions the limit.",
      ),
      s(
        "Draw when needed",
        "You use the limit as required and pay interest only on what you have drawn.",
      ),
    ],
  },
  "project-funding": {
    intro: "Project funding is released as the project moves forward. Here is how we arrange it.",
    steps: [
      s(
        "Share the project",
        "Tell us about the project, its cost, timeline and the funds you have already put in.",
      ),
      s(
        "Check the project papers",
        "We review approvals, cost estimates and the financials a lender will ask for.",
      ),
      s(
        "Structure the funding",
        "We shape the loan and the drawdown schedule around the project's stages.",
      ),
      s(
        "Lender appraisal",
        "Lenders appraise the project and the promoters, and may visit the site.",
      ),
      s(
        "Sanction and staged release",
        "After the sanction, money is released in stages as the work progresses.",
      ),
    ],
  },
  "working-capital": {
    intro: "Working capital keeps day-to-day business moving. Here is how we line it up.",
    steps: [
      s(
        "Understand your cash cycle",
        "Tell us how long it takes you to pay suppliers and to get paid.",
      ),
      s(
        "Assess the need",
        "We work out how much funding smooths that gap and which facility fits.",
      ),
      s("Shortlist lenders", "We approach lenders for the facility type and limit that suit you."),
      s(
        "Submit documents",
        "You provide financials, GST returns, bank statements and details of stock or receivables.",
      ),
      s(
        "Sanction and use",
        "The lender sanctions the limit and you use it as business needs, reviewed each year.",
      ),
    ],
  },
  "cash-credit": {
    intro:
      "A cash credit limit lets you draw and repay as business runs. Here is how it is arranged.",
    steps: [
      s(
        "Share your business details",
        "Tell us your turnover, your stock and receivables and the limit you want.",
      ),
      s("Work out the limit", "We estimate the limit your stock and receivables can support."),
      s("Choose a lender", "We compare lenders on rate, margin and renewal terms."),
      s(
        "Documents and inspection",
        "You submit financials and stock statements, and the lender may inspect your premises.",
      ),
      s(
        "Sanction and yearly review",
        "The limit is set against your stock and receivables, and reviewed every year.",
      ),
    ],
  },
  "overdraft-limit": {
    intro: "An overdraft limit is a cushion on your current account. Here is how to get one.",
    steps: [
      s("Tell us your need", "Share the limit you would like and how your account runs today."),
      s(
        "Check your account record",
        "We review your banking history and turnover to see what is realistic.",
      ),
      s(
        "Match a lender",
        "We shortlist banks and lenders who offer overdrafts on your kind of account.",
      ),
      s(
        "Documents and sanction",
        "You submit KYC and business papers, and the lender sanctions the limit.",
      ),
      s("Use as needed", "You draw when you need to, and interest is charged on the amount used."),
    ],
  },
  "bank-guarantee": {
    intro:
      "A bank guarantee tells your client that the bank stands behind you. Here is how it is issued.",
    steps: [
      s(
        "Share the contract",
        "Tell us what the guarantee is for, the amount, the beneficiary and the period.",
      ),
      s(
        "Decide the limit and margin",
        "We work out the facility size and the margin or security the bank will want.",
      ),
      s("Choose a bank", "We compare banks on their guarantee charges and terms."),
      s(
        "Documents and sanction",
        "You submit business papers and the contract details, and the bank sanctions the facility.",
      ),
      s("Guarantee issued", "The bank issues the guarantee in the format the beneficiary needs."),
    ],
  },
  "letter-of-credit": {
    intro: "A letter of credit assures your supplier of payment. Here is how we arrange one.",
    steps: [
      s(
        "Share the trade details",
        "Tell us about the supplier, the goods, the amount and the payment terms.",
      ),
      s(
        "Set up the facility",
        "We help you get an LC limit sanctioned with a bank that suits your trade.",
      ),
      s(
        "Apply for the letter",
        "You give the bank the purchase order and details so it can issue the letter.",
      ),
      s(
        "Supplier ships the goods",
        "Your supplier ships against the letter and presents the documents to the bank.",
      ),
      s(
        "Payment at maturity",
        "The bank pays the supplier, and you repay the bank on the agreed date.",
      ),
    ],
  },
  "working-capital-term-loan": {
    intro:
      "A working capital term loan resets a stretched cash cycle into fixed repayments. Here is how.",
    steps: [
      s(
        "Tell us what is stretched",
        "Share your existing dues, the cash gap and the amount you need.",
      ),
      s("Review your finances", "We look at your cash flow, existing loans and statements."),
      s("Structure the loan", "We plan a loan and repayment period that your cash flow can carry."),
      s(
        "Documents and approval",
        "You submit KYC, financials and bank statements, and the lender approves.",
      ),
      s("Disbursal and fixed EMIs", "The funds arrive and you repay in fixed monthly instalments."),
    ],
  },
  "machine-loan": {
    intro:
      "A machine loan funds equipment for your business. Here is the path from quote to delivery.",
    steps: [
      s("Share the equipment plan", "Tell us what machine you need, its price and the supplier."),
      s(
        "Get the supplier's quotation",
        "You obtain a quotation or proforma invoice from the supplier.",
      ),
      s("Match a lender", "We shortlist lenders who finance machinery for your kind of business."),
      s(
        "Documents and approval",
        "You submit KYC and business papers, and the lender reviews the file.",
      ),
      s(
        "Sanction and payment",
        "After the sanction, the lender pays the supplier and the machine is delivered.",
      ),
    ],
  },
  "personal-loan": {
    intro:
      "A personal loan needs little paperwork. Here is how it goes from request to money in your account.",
    steps: [
      s(
        "Tell us the amount",
        "Share how much you need, why, and how long you would like to repay.",
      ),
      s(
        "Check your eligibility",
        "We look at your income and credit record to see what you can borrow.",
      ),
      s("Compare offers", "You see rates, fees and EMIs from different lenders side by side."),
      s("Submit documents", "You upload KYC, income proof and bank statements."),
      s(
        "Approval and disbursal",
        "The lender approves and credits the money to your bank account.",
      ),
    ],
  },
  "loan-against-securities": {
    intro: "You borrow against your shares and bonds while staying invested. Here is how it works.",
    steps: [
      s(
        "Share your holdings",
        "Tell us which shares, mutual funds or bonds you hold and how much you need.",
      ),
      s(
        "Value the portfolio",
        "We check which holdings are accepted and the limit they can support.",
      ),
      s("Choose a lender", "We compare lenders on rate and the share of the value they will lend."),
      s(
        "Pledge the securities",
        "You submit KYC and pledge the securities through your depository.",
      ),
      s("Limit set and funds used", "The lender sets your limit, and you draw what you need."),
    ],
  },
  "professional-loan": {
    intro:
      "Professional loans are built around your qualification and practice. Here is how we arrange one.",
    steps: [
      s(
        "Tell us about your practice",
        "Share your qualification, your years in practice and why you need the funds.",
      ),
      s(
        "Check your income record",
        "We review your income, ITR and bank statements as a professional.",
      ),
      s(
        "Match a lender",
        "We shortlist lenders who offer special terms to professionals like you.",
      ),
      s(
        "Documents and approval",
        "You submit KYC, your professional registration and financial papers.",
      ),
      s("Sanction and disbursal", "The lender sanctions the loan and the funds are credited."),
    ],
  },
  "education-loan": {
    intro: "An education loan is planned around the course and the college. Here is how it moves.",
    steps: [
      s(
        "Share the course and college",
        "Tell us the course, the institution, the country and the fees.",
      ),
      s(
        "Plan the loan",
        "We work out the loan amount, whether collateral is needed and who will co-apply.",
      ),
      s("Choose a lender", "We compare lenders on rate, moratorium and coverage of costs."),
      s(
        "Submit documents",
        "You provide the admission proof, academic records, the co-applicant's income proof and KYC.",
      ),
      s(
        "Sanction and fee payment",
        "After the sanction, the lender usually pays the fees to the institution directly.",
      ),
    ],
  },
  "new-car-loan": {
    intro: "From choosing the car to driving it home, here is how a new car loan goes.",
    steps: [
      s("Choose your car", "Pick the model and get the dealer's quotation."),
      s("Check your eligibility", "We see what loan you qualify for and the EMI you can manage."),
      s("Compare offers", "You see rates, down payment and EMIs from different lenders."),
      s("Submit documents", "You provide KYC, income proof and bank statements."),
      s(
        "Approval and delivery",
        "The lender approves, pays the dealer, and the car is registered with the lender's charge noted.",
      ),
    ],
  },
  "used-car-loan": {
    intro: "A pre-owned car needs one extra check: the car itself. Here is how the loan works.",
    steps: [
      s("Pick the car", "Choose the car and share its make, year, price and registration details."),
      s("Check your eligibility", "We see what you qualify for, and the EMI that suits you."),
      s("Car valuation", "The lender values the car and checks its papers and history."),
      s("Submit documents", "You provide KYC and income proof, and the seller's ownership papers."),
      s(
        "Approval and transfer",
        "The lender approves and pays, and the ownership is moved into your name.",
      ),
    ],
  },
  "car-refinance": {
    intro: "A car you already own can raise money for other needs. Here is how.",
    steps: [
      s(
        "Share your car details",
        "Tell us the make, year, registration and any loan still running on it.",
      ),
      s("Value the car", "We estimate its value and the amount a lender can fund against it."),
      s("Choose a lender", "We compare lenders on rate, limit and tenure."),
      s(
        "Submit documents",
        "You provide the registration certificate, insurance, KYC and income proof.",
      ),
      s(
        "Sanction and disbursal",
        "After the lender's checks, the money is credited, and any old loan is closed first.",
      ),
    ],
  },
  "commercial-vehicle": {
    intro:
      "A commercial vehicle loan is planned around how the vehicle will earn. Here is how it goes.",
    steps: [
      s(
        "Tell us the vehicle you need",
        "Share the type, make, price and how you will use it in your business.",
      ),
      s(
        "Assess your business",
        "We look at your routes, contracts and earnings to see what you can borrow.",
      ),
      s(
        "Match a lender",
        "We shortlist lenders who finance commercial vehicles for your kind of work.",
      ),
      s("Submit documents", "You provide KYC, business proof and bank statements."),
      s(
        "Approval and delivery",
        "The lender approves and pays the dealer, and the vehicle is registered with the lender's charge noted.",
      ),
    ],
  },
};
