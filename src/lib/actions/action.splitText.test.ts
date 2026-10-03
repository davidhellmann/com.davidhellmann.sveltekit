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
    set: vi.fn(),
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
    set: mocks.set,
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
  hidden: boolean;
  normalize: () => void;
  removeAttribute: (name: string) => void;
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
    mocks.set.mockClear();
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
      hidden: true,
      normalize() {
        this.childNodes = this.childNodes.filter((child) => child.nodeType !== 3 || child.textContent !== "");
      },
      removeAttribute(name) {
        if (name === "hidden") this.hidden = false;
      }
    };

    useSplitText(node as unknown as HTMLElement);
    await Promise.resolve();

    expect(() => TestIntersectionObserver.current?.trigger()).not.toThrow();
    expect(mocks.splitTextCreate).toHaveBeenCalledOnce();
  });

  it("makes the server-hidden heading transparent before revealing its layout", () => {
    const removeAttribute = vi.fn();
    const node: TestNode = {
      childNodes: [{ nodeType: 3, textContent: "Frontier AI." }],
      getBoundingClientRect: () => ({ height: 120 }),
      hidden: true,
      normalize() {},
      removeAttribute
    };

    useSplitText(node as unknown as HTMLElement);

    expect(mocks.set).toHaveBeenCalledWith(node, { opacity: 0 });
    expect(removeAttribute).toHaveBeenCalledWith("hidden");
    expect(mocks.set.mock.invocationCallOrder[0]).toBeLessThan(removeAttribute.mock.invocationCallOrder[0]);
  });

  it("reveals the server-hidden heading immediately when reduced motion is preferred", () => {
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({ matches: query.includes("prefers-reduced-motion") })
    });
    const removeAttribute = vi.fn();
    const node: TestNode = {
      childNodes: [{ nodeType: 3, textContent: "Frontier AI." }],
      getBoundingClientRect: () => ({ height: 120 }),
      hidden: true,
      normalize() {},
      removeAttribute
    };

    useSplitText(node as unknown as HTMLElement);

    expect(removeAttribute).toHaveBeenCalledWith("hidden");
    expect(mocks.set).not.toHaveBeenCalledWith(node, { opacity: 0 });
  });
});
