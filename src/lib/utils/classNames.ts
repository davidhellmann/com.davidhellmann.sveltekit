import { type ClassValue, clsx } from "clsx";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";
import { type VariantProps, createTV } from "tailwind-variants/lite";

const defaultConfig = getDefaultConfig();
const customConfig = {
  ...defaultConfig,
  classGroups: {
    ...defaultConfig.classGroups,
    stack: [{ stack: [(value: string) => /^\d+$/.test(value)] }],
    "stack-space": [
      { "stack-space": [(value: string) => /^\d+$/.test(value)] },
      "stack-space-inherit",
      "stack-space-collapse"
    ],
    aspect: [...defaultConfig.classGroups.aspect, "aspect-instagram", "aspect-landscape", "aspect-portrait"],
    span: ["span-full", "span-popout", "span-content", "span-md", "span-lg", "span-xl"]
  },
  theme: {
    ...defaultConfig.theme,
    // Add fluid to the spacing scale
    spacing: [...defaultConfig.theme.spacing, "fluid"]
  },
  conflictingClassGroups: {
    ...defaultConfig.conflictingClassGroups,
    stack: ["stack"],
    "stack-space": ["stack-space"],
    span: ["span"]
  }
};
const customTwMerge = createTailwindMerge(() => {
  return { ...customConfig };
});

const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(inputs));
};

// Inject the custom tailwind-merge instance so `tv` and `cn` resolve conflicts identically.
const tv = createTV({ twMerge: customTwMerge });

export { cn, tv, type VariantProps };
