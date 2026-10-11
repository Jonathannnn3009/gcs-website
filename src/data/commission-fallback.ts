import type { CommissionRow } from "@/lib/commission";

// Fallback copy of the CRM's rate card (backend/prisma/seed.ts RATE_CARDS). The page shows the
// live card from /crm/api/public/commission-structure and uses this if the CRM is unreachable.
export const COMMISSION_STRUCTURE: CommissionRow[] = [
  { product: "Home Loan", range: "0.2% – 0.5%", avgAmount: "₹30L – ₹1Cr", earning: "₹6,000 – ₹50,000" },
  {
    product: "Loan Against Property",
    range: "0.5% – 1.0%",
    avgAmount: "₹20L – ₹75L",
    earning: "₹10,000 – ₹75,000",
  },
  {
    product: "Business Loan",
    range: "1.0% – 2.0%",
    avgAmount: "₹10L – ₹50L",
    earning: "₹10,000 – ₹1,00,000",
  },
  { product: "Personal Loan", range: "1.0% – 2.5%", avgAmount: "₹2L – ₹25L", earning: "₹2,000 – ₹62,500" },
  {
    product: "Working Capital Loan",
    range: "0.5% – 1.5%",
    avgAmount: "₹10L – ₹1Cr",
    earning: "₹5,000 – ₹1,50,000",
  },
  {
    product: "Loan Against Securities",
    range: "0.3% – 0.8%",
    avgAmount: "₹10L – ₹5Cr",
    earning: "₹3,000 – ₹4,00,000",
  },
  {
    product: "Project Funding",
    range: "0.5% – 1.0%",
    avgAmount: "₹50L – ₹10Cr",
    earning: "₹25,000 – ₹10,00,000",
  },
];
