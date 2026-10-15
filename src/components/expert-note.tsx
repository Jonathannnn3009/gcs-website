// A navy callout with the GCS mark, used under tables and guides to say what the expert does for you.

export function ExpertNote({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div
      className={`navy-panel flex items-center gap-4 rounded-2xl px-5 py-4 text-white sm:gap-5 sm:px-7 sm:py-5 ${className}`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white sm:h-14 sm:w-14">
        <img src="/brand/gcs-mark.png" alt="" className="h-[58%] w-auto" />
      </span>
      <p className="text-sm leading-relaxed text-white/90 sm:text-[15px]">{children}</p>
    </div>
  );
}
