import type { CommissionRow } from "@/lib/commission";

// Fallback copy of the CRM's rate card (backend/prisma/seed.ts RATE_CARDS). The page shows the
// live card from /crm/api/public/commission-structure and uses this if the CRM is unreachable.
export const COMMISSION_STRUCTURE: CommissionRow[] = [
  { product: "Home Loan", range: "0.1% – 0.3%", avgAmount: "₹30L – ₹1Cr", earning: "₹3,000 – ₹30,000" },
  {
    product: "Loan Against Property",
    range: "0.1% – 0.4%",
    avgAmount: "₹20L – ₹75L",
    earning: "₹2,000 – ₹30,000",
  },
  {
    product: "Business Loan",
    range: "0.1% – 0.6%",
    avgAmount: "₹10L – ₹50L",
    earning: "₹1,000 – ₹30,000",
  },
  { product: "Personal Loan", range: "0.1% – 0.6%", avgAmount: "₹2L – ₹25L", earning: "₹200 – ₹15,000" },
  {
    product: "Working Capital Loan",
    range: "0.1% – 0.4%",
    avgAmount: "₹10L – ₹1Cr",
    earning: "₹1,000 – ₹40,000",
  },
  {
    product: "Loan Against Securities",
    range: "0.1% – 0.3%",
    avgAmount: "₹10L – ₹5Cr",
    earning: "₹1,000 – ₹1,50,000",
  },
  {
    product: "Project Funding",
    range: "0.1% – 0.3%",
    avgAmount: "₹50L – ₹10Cr",
    earning: "₹5,000 – ₹3,00,000",
  },
];
