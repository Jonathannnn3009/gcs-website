// The icons staff can give a CA & legal service they add in the CRM (CA & Legal -> Services). The CRM stores the
// name; this turns it into the picture. An unknown or missing name falls back to the document icon.

import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calculator,
  FileSignature,
  FileText,
  Globe,
  HardHat,
  Home,
  Landmark,
  Percent,
  Receipt,
  Scale,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export const CA_LEGAL_ICONS: Record<string, LucideIcon> = {
  document: FileText,
  agreement: FileSignature,
  legal: Scale,
  tax: Receipt,
  percent: Percent,
  accounts: Calculator,
  registration: BadgeCheck,
  business: Building2,
  property: Home,
  government: Landmark,
  construction: HardHat,
  nri: Globe,
  family: Users,
  advisory: Briefcase,
  protection: ShieldCheck,
};

export const caLegalIcon = (name?: string): LucideIcon =>
  (name && CA_LEGAL_ICONS[name]) || FileText;
