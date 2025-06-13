import { type ClassValue, clsx } from "clsx";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";
import { createTV, type VariantProps } from "tailwind-variants";

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
    ]
  },
  theme: {
    ...defaultConfig.theme,
    // Add fluid to the spacing scale
    spacing: [...defaultConfig.theme.spacing, "fluid"],
  },
  conflictingClassGroups: {
    ...defaultConfig.conflictingClassGroups,
    stack: ["stack"],
    "stack-space": ["stack-space"]
  }
};
const customTwMerge = createTailwindMerge(() => {
  return { ...customConfig };
});

const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(inputs));
};

const tv = createTV({
  twMergeConfig: customConfig
});

export { cn, tv, type VariantProps };
