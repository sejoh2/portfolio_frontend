// Small Markdown renderer for blog posts. Builds React elements directly (no innerHTML),
// so post content can't inject scripts or markup.
// Supports: ## / ### headings, paragraphs, - and 1. lists, > quotes, ``` code blocks,
// **bold**, *italic*, `code`, [links](url) and ![images](url).

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|!\[[^\]]*\]\([^)\s]+\)|\[[^\]]+\]\([^)\s]+\))/g;

const safeUrl = (url) => (/^(https?:\/\/|\/|#|mailto:)/i.test(url) ? url : "#");

function inline(text, keyPrefix) {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-gray-800">{part.slice(1, -1)}</code>;
    }
    const image = part.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (image) {
      return <img key={key} src={safeUrl(image[2])} alt={image[1]} loading="lazy" className="my-6 w-full rounded-xl border border-gray-200" />;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = safeUrl(link[2]);
      const external = href.startsWith("http");
      return (
        <a key={key} href={href} className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700" {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const BLOCK_START = /^(#{2,3}\s|\s*(-|\*|\d+\.)\s|>\s?|```)/;

export default function Markdown({ children = "" }) {
  const lines = String(children).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = blocks.length;

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={key} className="overflow-x-auto rounded-xl bg-gray-900 p-4 font-mono text-sm leading-relaxed text-gray-100">
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      const Tag = level === 2 ? "h2" : "h3";
      blocks.push(
        <Tag key={key} className={`${level === 2 ? "mt-10 text-2xl" : "mt-8 text-xl"} font-bold tracking-tight text-gray-900`}>
          {inline(heading[2], key)}
        </Tag>
      );
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(
        <blockquote key={key} className="border-l-4 border-orange-400 bg-orange-50/60 py-3 pl-4 pr-3 italic text-gray-700">
          {inline(quote.join(" "), key)}
        </blockquote>
      );
      continue;
    }

    const list = line.match(/^\s*(-|\*|\d+\.)\s+/);
    if (list) {
      const ordered = /\d/.test(list[1]);
      const items = [];
      while (i < lines.length && /^\s*(-|\*|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*(-|\*|\d+\.)\s+/, ""));
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag key={key} className={`space-y-2 pl-6 ${ordered ? "list-decimal" : "list-disc"} marker:text-orange-500`}>
          {items.map((item, j) => (
            <li key={j}>{inline(item, `${key}-${j}`)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) paragraph.push(lines[i++]);
    blocks.push(<p key={key}>{inline(paragraph.join(" "), key)}</p>);
  }

  return <div className="space-y-5 text-[1.0625rem] leading-8 text-gray-700">{blocks}</div>;
}
