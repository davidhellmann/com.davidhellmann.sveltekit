import { describe, expect, it } from "vitest";
import { createRssRedirectResponse, createRssXmlResponse } from "./response";

describe("RSS response helpers", () => {
  it("creates an RSS XML response with the correct content type", async () => {
    const response = createRssXmlResponse("<rss></rss>");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    await expect(response.text()).resolves.toBe("<rss></rss>");
  });

  it("creates a permanent compatibility redirect to the canonical feed", () => {
    const response = createRssRedirectResponse();

    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe("/rss.xml");
  });
});
