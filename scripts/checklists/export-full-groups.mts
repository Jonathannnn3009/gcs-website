import { writeFileSync } from "node:fs";
import { PROFESSIONAL_SERVICES } from "../../src/data/professional-services.ts";
const out: Record<string, unknown> = {};
for (const s of PROFESSIONAL_SERVICES) if (s.detail) out[s.slug] = s.detail.documentGroups;
writeFileSync(new URL("./full-document-groups.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(Object.keys(out));
