import { beforeEach, describe, expect, it, vi } from "vitest";

const cmsMocks = vi.hoisted(() => ({
  getWorkEntriesData: vi.fn(),
  getWorkListPageEntries: vi.fn()
}));

vi.mock("$graphql/cms-content", () => cmsMocks);

import { load } from "./+page.server";

describe("work page server load", () => {
  beforeEach(() => {
    cmsMocks.getWorkListPageEntries.mockResolvedValue([]);
    cmsMocks.getWorkEntriesData.mockResolvedValue({ entries: [] });
  });

  it("uses a positive Craft-compatible collection limit", async () => {
    await load({} as never);

    expect(cmsMocks.getWorkEntriesData).toHaveBeenCalledWith({
      limit: 100,
      fullContent: false
    });
  });
});
