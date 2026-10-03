import type { ReactNode } from "react";

/**
 * Renders model output safely. Text is turned into React elements only (never
 * innerHTML), supporting the small subset the system prompt allows:
 * paragraphs, "- " / "1. " list items and **bold**. Anything else, including
 * HTML or links, is displayed as plain text.
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*\n]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={`${keyPrefix}-${i}`} className="font-medium text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

type Block = { type: "p"; text: string } | { type: "ul" | "ol"; items: string[] };

const BULLET = /^\s*[-*•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const rawLine of source.split("\n")) {
    const line = rawLine.replace(/^#{1,6}\s+/, "");
    if (!line.trim()) {
      flush();
      continue;
    }
    const listType = BULLET.test(line) ? "ul" : NUMBERED.test(line) ? "ol" : null;
    if (listType) {
      flush();
      const item = line.replace(listType === "ul" ? BULLET : NUMBERED, "");
      const last = blocks[blocks.length - 1];
      if (last && last.type === listType) last.items.push(item);
      else blocks.push({ type: listType, items: [item] });
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();
  return blocks;
}

export function AnswerText({ text }: { text: string }) {
  return (
    <>
      {parse(text).map((block, i) => {
        if (block.type === "p") return <p key={i}>{inline(block.text, `p${i}`)}</p>;
        const List = block.type;
        return (
          <List key={i} className={List === "ol" ? "list-decimal space-y-1.5 pl-5" : "space-y-1.5"}>
            {block.items.map((item, j) => (
              <li key={j} className={List === "ul" ? "flex gap-3" : undefined}>
                {List === "ul" ? (
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-cyan/70" />
                ) : null}
                <span>{inline(item, `l${i}-${j}`)}</span>
              </li>
            ))}
          </List>
        );
      })}
    </>
  );
}
