import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const splitTextCreate = vi.fn((node: HTMLElement) => {
    const hasEmptyTextNode = Array.from(node.childNodes).some(
      (child) => child.nodeType === 3 && child.textContent === ""
    );

    if (hasEmptyTextNode) {
      throw new TypeError("Cannot read properties of undefined (reading 'charAt')");
    }

    return {
      chars: [],
      isSplit: true,
      lines: [],
      revert: vi.fn(),
      words: []
    };
  });

  return {
    splitTextCreate,
    timeline: vi.fn(() => ({
      fromTo: vi.fn(),
      kill: vi.fn(),
      to: vi.fn()
    }))
  };
});

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    timeline: mocks.timeline,
    utils: { random: vi.fn(() => 1) }
  }
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: { create: mocks.splitTextCreate }
}));

import { useSplitText } from "./action.splitText";

type TestNode = {
  childNodes: Array<{ nodeType: number; textContent: string }>;
  getBoundingClientRect: () => { height: number };
  normalize: () => void;
};

class TestIntersectionObserver {
  static current: TestIntersectionObserver | undefined;

  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    TestIntersectionObserver.current = this;
  }

  disconnect() {}

  observe() {}

  trigger() {
    this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe("useSplitText", () => {
  beforeEach(() => {
    mocks.splitTextCreate.mockClear();
    mocks.timeline.mockClear();
    TestIntersectionObserver.current = undefined;

    vi.stubGlobal("document", {
      fonts: { ready: Promise.resolve() }
    });
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false })
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes empty SPA text nodes before handing the heading to SplitText", async () => {
    const node: TestNode = {
      childNodes: [
        { nodeType: 3, textContent: "Work hard." },
        { nodeType: 3, textContent: "" }
      ],
      getBoundingClientRect: () => ({ height: 120 }),
      normalize() {
        this.childNodes = this.childNodes.filter((child) => child.nodeType !== 3 || child.textContent !== "");
      }
    };

    useSplitText(node as unknown as HTMLElement);
    await Promise.resolve();

    expect(() => TestIntersectionObserver.current?.trigger()).not.toThrow();
    expect(mocks.splitTextCreate).toHaveBeenCalledOnce();
  });
});
