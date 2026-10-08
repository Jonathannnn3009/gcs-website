import type { ReactNode } from "react";

/**
 * Renders the simple formatting staff type into a page body, without any raw HTML:
 *   ## Heading      -> a heading
 *   - item          -> a bullet list
 *   blank line      -> a new paragraph
 *   **bold**, [text](https://link)
 * Anything else is shown as plain text, so pasted content can never inject markup.
 */
const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/)/i;

function inline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let i = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(
        <strong key={`${keyBase}-${i++}`} className="font-bold text-navy dark:text-white">
          {m[1]}
        </strong>,
      );
    } else if (m[2] !== undefined && m[3] !== undefined) {
      const href = m[3];
      parts.push(
        SAFE_LINK.test(href) ? (
          <a
            key={`${keyBase}-${i++}`}
            href={href}
            className="font-semibold text-gold-dark underline underline-offset-2"
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[2]}
          </a>
        ) : (
          m[0]
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (lines.length === 0) return null;
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={bi} className="list-disc space-y-1.5 pl-6">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*-\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        if (/^##\s+/.test(lines[0] ?? "")) {
          return (
            <div key={bi} className="space-y-3">
              <h2 className="pt-2 text-2xl font-extrabold text-navy dark:text-white">
                {(lines[0] ?? "").replace(/^##\s+/, "")}
              </h2>
              {lines.length > 1 && <p>{inline(lines.slice(1).join(" "), `${bi}`)}</p>}
            </div>
          );
        }
        return <p key={bi}>{inline(lines.join(" "), `${bi}`)}</p>;
      })}
    </div>
  );
}
