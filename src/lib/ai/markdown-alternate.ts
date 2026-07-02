export const getMarkdownAlternate = (path: string) => {
  const normalizedPath = path.replace(/\/$/, "");

  if (normalizedPath === "/about") return "/about.md";

  const match = normalizedPath.match(/^\/(blog|work)\/([^/]+)$/);
  if (!match) return null;

  const [, section, slug] = match;
  if (!slug || !Number.isNaN(Number(slug)) || slug.includes(".")) return null;

  return `/${section}/${slug}.md`;
};
