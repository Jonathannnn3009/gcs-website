import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "h-8", name: "text-[14px] mt-1", sub: "text-[8.5px] mt-1", rule: "w-3" },
  md: { mark: "h-14", name: "text-lg mt-1.5", sub: "text-[10px] mt-1.5", rule: "w-5" },
  lg: { mark: "h-20", name: "text-2xl mt-2", sub: "text-xs mt-2", rule: "w-8" },
} as const;

/** Brand lockup: the G mark with "Growth Capital Services" set beneath it (no tagline). */
export function BrandLogo({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <img
        src="/brand/gcs-mark.png"
        alt=""
        width={420}
        height={365}
        className={cn(s.mark, "w-auto object-contain mix-blend-multiply")}
      />
      <span
        className={cn(
          "font-brand font-semibold tracking-[0.04em] whitespace-nowrap text-navy uppercase",
          s.name,
        )}
      >
        Growth Capital
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-brand font-medium whitespace-nowrap text-gold-dark uppercase",
          s.sub,
        )}
      >
        <span className={cn("h-px bg-gold/70", s.rule)} />
        {/* Negative margin cancels the trailing letter-spacing so the rules sit evenly */}
        <span className="-mr-[0.42em] tracking-[0.42em]">Services</span>
        <span className={cn("h-px bg-gold/70", s.rule)} />
      </span>
    </span>
  );
}
