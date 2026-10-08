// The language a visitor reads the site in. English is the site's own wording; Hindi and Marathi
// are translations staff add in the CRM (wording per page, keyed by the original English).
// The choice is remembered in the browser and can be forced with ?lang=hi.

import { useEffect, useState } from "react";

export type Lang = "en" | "hi" | "mr";

export const LANGUAGES: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हिं", name: "Hindi" },
  { code: "mr", label: "मरा", name: "Marathi" },
];

const STORAGE_KEY = "gcs.lang";
const listeners = new Set<(l: Lang) => void>();
let current: Lang = "en";
let initialised = false;

const isLang = (v: unknown): v is Lang => v === "en" || v === "hi" || v === "mr";

function init() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const pick = isLang(fromUrl) ? fromUrl : isLang(stored) ? stored : "en";
    current = pick;
    if (isLang(fromUrl)) window.localStorage.setItem(STORAGE_KEY, fromUrl);
  } catch {
    current = "en";
  }
}

export function setLanguage(lang: Lang) {
  current = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage blocked: the choice just won't be remembered
  }
  document.documentElement.lang = lang;
  for (const l of listeners) l(lang);
}

/** The chosen language. Always "en" during the server render and first paint, so pages hydrate cleanly. */
export function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    init();
    setLang(current);
    document.documentElement.lang = current;
    listeners.add(setLang);
    return () => {
      listeners.delete(setLang);
    };
  }, []);
  return lang;
}
