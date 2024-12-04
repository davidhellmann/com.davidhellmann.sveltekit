import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const svgUrl = url.searchParams.get("svgUrl");
  if (!svgUrl) throw error(400, "Missing SVG URL");

  const response = await fetch(svgUrl);
  if (!response.ok) throw error(500, "Failed to fetch SVG");

  const svgContent = await response.text();
  return new Response(svgContent, {
    headers: { "Content-Type": "image/svg+xml" }
  });
};
