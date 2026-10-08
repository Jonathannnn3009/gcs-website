import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { CRM_API } from "@/lib/crm";
import {
  applyOverrides,
  normalizePath,
  originalOf,
  overridesFor,
  type PageTextMap,
} from "@/lib/page-text";
import { updateSiteContent, useSiteContent } from "@/lib/site-content";

// The same browser storage key the CRM uses, so an admin signed in to the CRM on this domain is
// recognised here. On the live site the website and CRM share one domain.
const TOKEN_KEY = "gcs_crm_token";

const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

type Target = { node: Text; original: string; current: string };

/** The text under the click, if any: the exact text node, found from the click position. */
function textNodeAt(x: number, y: number, el: Element): Text | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  const hit =
    doc.caretPositionFromPoint?.(x, y)?.offsetNode ??
    doc.caretRangeFromPoint?.(x, y)?.startContainer;
  if (hit && hit.nodeType === Node.TEXT_NODE && hit.nodeValue?.trim()) return hit as Text;
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) return child as Text;
  }
  return null;
}

/**
 * Admin-only. When an admin is signed in to the CRM, a small "Edit text" button appears; in edit
 * mode any wording on the page can be clicked and rewritten, then saved to the CRM so every
 * visitor sees it.
 */
export function InlineEditor() {
  const pathname = normalizePath(useRouterState({ select: (s) => s.location.pathname }));
  const content = useSiteContent();
  const [admin, setAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [draftText, setDraftText] = useState("");
  const [allPages, setAllPages] = useState(false);
  const [draft, setDraft] = useState<PageTextMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const draftRef = useRef<PageTextMap | null>(null);
  draftRef.current = draft;

  // Is the person signed in to the CRM as an admin?
  useEffect(() => {
    const token = readToken();
    if (!token) return;
    const ctrl = new AbortController();
    fetch(`${CRM_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((me: { role?: string } | null) => setAdmin(me?.role === "ADMIN"))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  const working = draft ?? content.pageText ?? {};
  const edits = Object.keys(overridesFor(draft ?? undefined, pathname)).length;
  const dirty = draft !== null;

  // Edit mode: clicks pick text instead of following links or pressing buttons.
  useEffect(() => {
    if (!editing) return;
    document.body.setAttribute("data-gcs-editing", "");
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || el.closest("[data-gcs-edit-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const node = textNodeAt(e.clientX, e.clientY, el);
      if (!node) return;
      const original = originalOf(node);
      setTarget({ node, original, current: node.nodeValue ?? "" });
      setDraftText((node.nodeValue ?? "").trim());
      setAllPages(Boolean(node.parentElement?.closest("header, footer")));
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.body.removeAttribute("data-gcs-editing");
    };
  }, [editing]);

  const applyChange = useCallback(() => {
    if (!target) return;
    const key = target.original.trim();
    const value = draftText.trim();
    if (!key || !value) return;
    const base: PageTextMap = JSON.parse(
      JSON.stringify(draftRef.current ?? content.pageText ?? {}),
    );
    const scope = allPages ? "*" : pathname;
    const bucket = (base[scope] ??= {});
    if (value === key) delete bucket[key];
    else bucket[key] = value;
    if (Object.keys(bucket).length === 0) delete base[scope];
    setDraft(base);
    // Show it now, on this page, before saving.
    applyOverrides(document.body, overridesFor(base, pathname));
    setTarget(null);
  }, [target, draftText, allPages, pathname, content.pageText]);

  const save = async () => {
    const token = readToken();
    if (!token || !draft) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${CRM_API}/settings/site-content/pageText`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: draft }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      updateSiteContent({ pageText: draft });
      setDraft(null);
      setMessage("Saved — live for every visitor.");
    } catch {
      setMessage("Could not save. Sign in to the CRM again and retry.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(null);
    setTarget(null);
    setEditing(false);
    // Redraw with what is saved.
    applyOverrides(document.body, overridesFor(content.pageText, pathname));
  };

  if (!admin) return null;

  return (
    <div data-gcs-edit-ui className="fixed bottom-4 left-4 z-[70] font-sans text-sm">
      <style>{`body[data-gcs-editing] *:hover{outline:1px dashed #c9a24b;outline-offset:2px;cursor:text}body[data-gcs-editing] [data-gcs-edit-ui] *:hover{outline:none;cursor:auto}`}</style>
      {!editing ? (
        <button
          onClick={() => {
            setMessage("");
            setEditing(true);
          }}
          className="flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 font-bold text-white shadow-lg ring-1 ring-gold/40"
        >
          <Pencil className="h-4 w-4 text-gold" /> Edit text
        </button>
      ) : (
        <div className="w-72 rounded-xl bg-navy p-3 text-white shadow-2xl ring-1 ring-gold/40">
          <p className="text-xs leading-relaxed text-white/80">
            Click any wording on this page to change it.{" "}
            {edits > 0 && `${edits} change(s) on this page.`}
          </p>
          {message && <p className="mt-2 text-xs text-gold">{message}</p>}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => void save()}
              disabled={!dirty || saving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold py-2 font-bold text-navy disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save
            </button>
            <button
              onClick={dirty ? cancel : () => setEditing(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/30 py-2 font-semibold"
            >
              <X className="h-4 w-4" /> {dirty ? "Discard" : "Done"}
            </button>
          </div>
        </div>
      )}

      {editing && target && (
        <div className="fixed inset-x-4 bottom-24 z-[71] mx-auto w-auto max-w-md rounded-xl bg-white p-4 text-navy shadow-2xl ring-1 ring-border sm:left-4 sm:mx-0 sm:bottom-28">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Edit wording
          </p>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={Math.min(8, Math.max(3, Math.ceil(draftText.length / 40)))}
            className="mt-2 w-full rounded-lg border border-border bg-white p-2.5 text-sm text-navy outline-none focus:border-gold"
            autoFocus
          />
          <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={allPages}
              onChange={(e) => setAllPages(e.target.checked)}
            />
            Use on every page (menu, footer, repeated lines)
          </label>
          <div className="mt-3 flex gap-2">
            <button
              onClick={applyChange}
              className="flex-1 rounded-lg bg-navy py-2 text-sm font-bold text-white"
            >
              Apply
            </button>
            {working && target.current.trim() !== target.original.trim() && (
              <button
                onClick={() => setDraftText(target.original.trim())}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold"
              >
                Original
              </button>
            )}
            <button
              onClick={() => setTarget(null)}
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
