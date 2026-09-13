import { useId, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { submitLead } from "@/lib/leads";

const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

const fieldClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20";

export function ChecklistGate({ pdfHref, productTitle }: { pdfHref: string; productTitle: string }) {
  const uid = useId();
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (!PHONE_RE.test(phone.replace(/[\s-]/g, ""))) next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    await submitLead({ name: name.trim(), phone: phone.trim(), source: "checklist-download", detail: productTitle });
    setSubmitting(false);
    setUnlocked(true);
  };

  if (unlocked) {
    return (
      <a
        href={pdfHref}
        download
        className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/10 py-3 text-sm font-bold text-gold-light transition-colors hover:bg-gold/20"
      >
        <Download className="h-4 w-4" /> Download Now
      </a>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 py-3 text-sm font-bold text-gold-light transition-colors hover:bg-white/5"
      >
        <Download className="h-4 w-4" /> Download Checklist (PDF)
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5 rounded-lg border border-white/15 bg-white/5 p-4">
      <p className="text-xs leading-relaxed text-white/60">
        Share your name and number and we'll unlock the download — an advisor may follow up.
      </p>
      <div className="mt-3 space-y-3">
        <div>
          <label htmlFor={`${uid}-name`} className="text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Full Name
          </label>
          <input
            id={`${uid}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Enter your name"
            maxLength={100}
          />
          {errors.name && <span className="mt-1 block text-xs text-red-300">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder="10-digit mobile"
            inputMode="tel"
            maxLength={15}
          />
          {errors.phone && <span className="mt-1 block text-xs text-red-300">{errors.phone}</span>}
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
      >
        {submitting ? "Please wait..." : "Unlock Download"}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
