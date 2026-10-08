import { useEffect, useState } from "react";
import { LANGUAGES, setLanguage, useLanguage } from "@/lib/language";
import { useSiteContent } from "@/lib/site-content";

/**
 * EN | हिं | मरा. Shown once at least one translation exists in the CRM, and to a signed-in admin
 * so they can switch language and start translating with Edit text.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const lang = useLanguage();
  const content = useSiteContent();
  // Read after mount so the server render and the first client render match.
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    try {
      setSignedIn(Boolean(window.localStorage.getItem("gcs_crm_token")));
    } catch {
      setSignedIn(false);
    }
  }, []);

  const hasTranslations =
    Object.keys(content["pageText:hi"] ?? {}).length > 0 ||
    Object.keys(content["pageText:mr"] ?? {}).length > 0;
  if (!hasTranslations && !signedIn && lang === "en") return null;

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border border-border text-xs font-bold ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLanguage(l.code)}
          aria-pressed={lang === l.code}
          title={l.name}
          className={`px-2.5 py-1.5 transition-colors ${
            lang === l.code ? "bg-navy text-white" : "text-muted-foreground hover:text-navy"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
