import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

/**
 * Small, auto-dismissing confirmation banner, portalled to <body> so it sits
 * above everything regardless of where it's triggered from.
 */
export function Toast({
  message,
  show,
  onClose,
  duration = 4500,
}: {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex justify-center px-4 sm:top-24"
    >
      <div className="toast-pop pointer-events-auto flex items-center gap-3 rounded-full bg-[#1f8a4c] py-3 pr-3 pl-4 text-sm font-semibold text-white shadow-[0_14px_34px_-10px_rgba(15,90,50,0.55)]">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
