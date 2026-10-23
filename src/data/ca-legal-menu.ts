// What the "CA & Legal" header dropdown lists: the two teams, and the categories each one covers.
// Every category links to its spot on the CA & Legal listing page (see categoryAnchor).

import {
  BadgeCheck,
  Building2,
  Calculator,
  FileSignature,
  Globe,
  HardHat,
  Home,
  Landmark,
  Percent,
  Receipt,
  Scale,
  type LucideIcon,
} from "lucide-react";

/** The id of a category's first service on the listing page. */
export const categoryAnchor = (category: string) =>
  `cat-${category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

export type CaLegalMenuGroup = {
  /** Matches the division ids on the listing page. */
  anchor: string;
  heading: string;
  items: { category: string; icon: LucideIcon; desc: string }[];
};

export const CA_LEGAL_MENU: CaLegalMenuGroup[] = [
  {
    anchor: "ca-services",
    heading: "CA Services",
    items: [
      { category: "Tax & Income Tax", icon: Receipt, desc: "ITR, tax planning, TDS" },
      { category: "GST & Compliance", icon: Percent, desc: "Registration, returns, notices" },
      { category: "Accounting & Audit", icon: Calculator, desc: "Bookkeeping, tax audit" },
      { category: "Business Registration", icon: BadgeCheck, desc: "Company, MSME, Shop Act, PAN" },
    ],
  },
  {
    anchor: "legal-services",
    heading: "Legal Services",
    items: [
      { category: "Legal Drafting", icon: FileSignature, desc: "Agreements, affidavits, notices" },
      { category: "Property Legal Services", icon: Scale, desc: "Title checks, deeds, POA" },
      { category: "Housing Society Services", icon: Home, desc: "Share transfer, society NOC" },
      { category: "SRA / MHADA / MMRDA", icon: Landmark, desc: "Flat transfer documentation" },
      { category: "Redevelopment", icon: HardHat, desc: "Society redevelopment papers" },
      {
        category: "NRI & Family Property Services",
        icon: Globe,
        desc: "NRI property, wills, succession",
      },
    ],
  },
];
