import { beforeEach, describe, expect, it, vi } from "vitest";

const cmsMocks = vi.hoisted(() => ({
  getWorkList: vi.fn(),
  getWorkProjects: vi.fn()
}));

vi.mock("$graphql/cms-content", () => cmsMocks);

import { load } from "./+page.server";

describe("work page server load", () => {
  beforeEach(() => {
    cmsMocks.getWorkList.mockResolvedValue(undefined);
    cmsMocks.getWorkProjects.mockResolvedValue({ entries: [] });
  });

  it("uses a positive Craft-compatible collection limit", async () => {
    await load({} as never);

    expect(cmsMocks.getWorkProjects).toHaveBeenCalledWith({
      limit: 100,
      fullContent: false
    });
  });
});
