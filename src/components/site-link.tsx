import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** A link whose address staff typed: an outside address opens as a normal link, a page address uses the router. */
export function SiteLink({
  to,
  className,
  children,
  onClick,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (/^(https?:|mailto:|tel:)/i.test(to)) {
    return (
      <a
        href={to}
        className={className}
        onClick={onClick}
        {...(to.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  const [path, hash] = to.split("#");
  return (
    <Link
      to={(path || "/") as "/"}
      {...(hash ? { hash } : {})}
      className={className}
      {...(onClick ? { onClick } : {})}
    >
      {children}
    </Link>
  );
}
