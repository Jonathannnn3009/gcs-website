import type { ReactNode } from "react";

/**
 * Renders the small amount of formatting the assistant uses (**bold**, bullet and numbered lists,
 * [links](/path)) without ever touching raw HTML, so nothing it writes can inject markup. Anything
 * else shows as plain text.
 */

const INTERNAL = /^\/[^\s]*$/;
const EXTERNAL = /^https?:\/\/[^\s]+$/i;
const CONTACT_LINK = /^(tel:|mailto:)[^\s]+$/i;

/** Mid-stream the text may end half way through "**bold**" or "[link](/pa"; hide the stub until it completes. */
function hideUnfinished(text: string): string {
  let out = text.replace(/\[[^\]\n]*$/, "").replace(/\[[^\]\n]*\]\([^)\n]*$/, "");
  const marks = out.match(/\*\*/g)?.length ?? 0;
  if (marks % 2 === 1) {
    const at = out.lastIndexOf("**");
    out = out.slice(0, at) + out.slice(at + 2);
  }
  return out;
}

type Block = { kind: "p"; lines: string[] } | { kind: "ul" | "ol"; items: string[] };

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let last: Block | null = null;
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      last = null;
      continue;
    }
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    const number = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet) {
      if (last?.kind === "ul") last.items.push(bullet[1] ?? "");
      else blocks.push((last = { kind: "ul", items: [bullet[1] ?? ""] }));
    } else if (number) {
      if (last?.kind === "ol") last.items.push(number[1] ?? "");
      else blocks.push((last = { kind: "ol", items: [number[1] ?? ""] }));
    } else if (last?.kind === "p") {
      last.lines.push(line);
    } else {
      blocks.push((last = { kind: "p", lines: [line] }));
    }
  }
  return blocks;
}

export function ChatMarkdown({
  text,
  streaming = false,
  onNavigate,
}: {
  text: string;
  streaming?: boolean;
  /** Called with an internal path when a link is followed; the widget uses it to route without a reload. */
  onNavigate: (href: string) => void;
}) {
  const inline = (source: string, key: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let i = 0;
    for (let m = re.exec(source); m; m = re.exec(source)) {
      if (m.index > last) parts.push(source.slice(last, m.index));
      if (m[1] !== undefined) {
        parts.push(
          <strong key={`${key}-${i++}`} className="font-bold text-navy">
            {m[1]}
          </strong>,
        );
      } else if (m[2] !== undefined && m[3] !== undefined) {
        const href = m[3];
        const label = m[2];
        if (INTERNAL.test(href)) {
          parts.push(
            <a
              key={`${key}-${i++}`}
              href={href}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onNavigate(href);
              }}
              className="font-semibold text-gold-dark underline underline-offset-2 hover:text-navy"
            >
              {label}
            </a>,
          );
        } else if (EXTERNAL.test(href) || CONTACT_LINK.test(href)) {
          parts.push(
            <a
              key={`${key}-${i++}`}
              href={href}
              {...(EXTERNAL.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-semibold text-gold-dark underline underline-offset-2 hover:text-navy"
            >
              {label}
            </a>,
          );
        } else {
          parts.push(label); // not a link we trust: show the words only
        }
      }
      last = m.index + m[0].length;
    }
    if (last < source.length) parts.push(source.slice(last));
    return parts;
  };

  const blocks = parse(streaming ? hideUnfinished(text) : text);
  return (
    <div className="space-y-2">
      {blocks.map((b, bi) => {
        if (b.kind === "p") {
          return (
            <p key={bi}>
              {b.lines.map((l, li) => (
                <span key={li}>
                  {li > 0 && <br />}
                  {inline(l, `${bi}-${li}`)}
                </span>
              ))}
            </p>
          );
        }
        const List = b.kind === "ul" ? "ul" : "ol";
        return (
          <List
            key={bi}
            className={`space-y-1 pl-5 ${b.kind === "ul" ? "list-disc marker:text-gold" : "list-decimal marker:font-semibold marker:text-gold-dark"}`}
          >
            {b.items.map((it, ii) => (
              <li key={ii}>{inline(it, `${bi}-${ii}`)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
