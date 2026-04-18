import { parse, HTMLElement, TextNode, type Node } from "node-html-parser";

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

const escapeMd = (s: string) => s.replace(/([\\`*_{}\[\]()#+\-.!])/g, "\\$1");

const inline = (node: Node): string => {
  if (node instanceof TextNode) return decodeEntities(node.text);
  if (!(node instanceof HTMLElement)) return "";

  const inner = () => node.childNodes.map(inline).join("");
  const tag = node.tagName?.toLowerCase();

  switch (tag) {
    case "strong":
    case "b":
      return `**${inner()}**`;
    case "em":
    case "i":
      return `*${inner()}*`;
    case "code":
      return `\`${node.text}\``;
    case "a": {
      const href = node.getAttribute("href") || "";
      return href ? `[${inner()}](${href})` : inner();
    }
    case "br":
      return "  \n";
    case "img": {
      const src = node.getAttribute("src") || "";
      const alt = node.getAttribute("alt") || "";
      return src ? `![${alt}](${src})` : "";
    }
    default:
      return inner();
  }
};

const block = (node: Node, depth = 0): string => {
  if (node instanceof TextNode) {
    const t = decodeEntities(node.text).trim();
    return t ? t : "";
  }
  if (!(node instanceof HTMLElement)) return "";

  const tag = node.tagName?.toLowerCase();
  const children = () => node.childNodes.map((c) => block(c, depth)).filter(Boolean).join("\n\n");

  switch (tag) {
    case "h1":
      return `# ${node.childNodes.map(inline).join("").trim()}`;
    case "h2":
      return `## ${node.childNodes.map(inline).join("").trim()}`;
    case "h3":
      return `### ${node.childNodes.map(inline).join("").trim()}`;
    case "h4":
      return `#### ${node.childNodes.map(inline).join("").trim()}`;
    case "h5":
      return `##### ${node.childNodes.map(inline).join("").trim()}`;
    case "h6":
      return `###### ${node.childNodes.map(inline).join("").trim()}`;
    case "p":
      return node.childNodes.map(inline).join("").trim();
    case "blockquote":
      return children()
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n");
    case "pre": {
      const code = node.querySelector("code");
      const lang = code?.getAttribute("class")?.match(/language-(\S+)/)?.[1] ?? "";
      return `\`\`\`${lang}\n${(code?.text ?? node.text).replace(/\n+$/, "")}\n\`\`\``;
    }
    case "ul":
      return node
        .querySelectorAll(":scope > li")
        .map((li) => `- ${li.childNodes.map(inline).join("").trim()}`)
        .join("\n");
    case "ol":
      return node
        .querySelectorAll(":scope > li")
        .map((li, i) => `${i + 1}. ${li.childNodes.map(inline).join("").trim()}`)
        .join("\n");
    case "hr":
      return "---";
    case "img": {
      const src = node.getAttribute("src") || "";
      const alt = node.getAttribute("alt") || "";
      return src ? `![${alt}](${src})` : "";
    }
    case "div":
    case "section":
    case "article":
    case "main":
      return children();
    default:
      return node.childNodes.map(inline).join("").trim();
  }
};

export const htmlToMarkdown = (html: string | null | undefined): string => {
  if (!html?.trim()) return "";
  const root = parse(html, { blockTextElements: { script: false, style: false } });
  return root.childNodes
    .map((n) => block(n))
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export { escapeMd };
