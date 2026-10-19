import type { CommissionRow } from "@/lib/commission";

// Fallback copy of the CRM's rate card (backend/prisma/seed.ts RATE_CARDS). The page shows the
// live card from /crm/api/public/commission-structure and uses this if the CRM is unreachable.
// Earnings are the smallest amount x the minimum rate up to the largest amount x the maximum rate.
export const COMMISSION_STRUCTURE: CommissionRow[] = [
  { product: "Home Loan", range: "0.1% – 0.3%", avgAmount: "₹30L – ₹1Cr", earning: "₹3,000 – ₹30,000" },
  {
    product: "Loan Against Property",
    range: "0.1% – 0.5%",
    avgAmount: "₹20L – ₹1Cr",
    earning: "₹2,000 – ₹50,000",
  },
  {
    product: "Business Loan",
    range: "0.1% – 1%",
    avgAmount: "₹10L – ₹1Cr",
    earning: "₹1,000 – ₹1,00,000",
  },
  { product: "Personal Loan", range: "0.1% – 1%", avgAmount: "₹2L – ₹50L", earning: "₹200 – ₹50,000" },
  {
    product: "Working Capital Loan",
    range: "0.1% – 0.3%",
    avgAmount: "₹10L – ₹1Cr",
    earning: "₹1,000 – ₹30,000",
  },
  {
    product: "Project Funding",
    range: "0.05% – 0.1%",
    avgAmount: "₹1Cr – ₹10Cr",
    earning: "₹5,000 – ₹1,00,000",
  },
];
