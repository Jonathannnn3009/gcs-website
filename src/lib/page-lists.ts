// Repeated blocks on the public pages (hero points, steps, benefits, stats...). The CRM's list,
// when staff have saved one, replaces the built-in items; otherwise the built-in items are used.

import { ICONS } from "@/lib/icon-map";
import { LIST_SPECS, type ListItem } from "@/data/page-lists";
import { useSiteContent } from "@/lib/site-content";

export function useList<T extends ListItem>(key: string, builtIn: T[]): T[] {
  const saved = useSiteContent().lists?.[key];
  const spec = LIST_SPECS.find((s) => s.key === key);
  if (!spec || !Array.isArray(saved) || saved.length === 0) return builtIn;

  // A new item with no icon picked borrows the first icon the built-in list uses.
  const fallbackIcon =
    Object.values(builtIn[0] ?? {}).find((v) => typeof v === "function") ?? ICONS["Sparkles"];

  const items = saved
    .filter((raw) => raw && typeof raw === "object")
    .map((raw) => {
      const item: ListItem = {};
      for (const f of spec.fields) {
        const value = raw[f.key];
        if (f.kind === "icon") {
          item[f.key] = (ICONS[String(value)] ?? fallbackIcon) as ListItem[string];
        } else {
          item[f.key] = typeof value === "string" ? value : "";
        }
      }
      return item;
    })
    // an item needs its main text; a half-filled new row is skipped
    .filter((item) => {
      const main = spec.fields.find((f) => f.kind !== "icon");
      return main ? String(item[main.key] ?? "").trim() !== "" : true;
    });
  return items.length > 0 ? (items as T[]) : builtIn;
}
