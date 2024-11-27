import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "../settings/colors.mjs";
import screens from "../settings/screens.mjs";

// Plugins
import containerQueries from "@tailwindcss/container-queries";
import fluidType from "tailwindcss-fluid-type";

export default {
  future: {
    hoverOnlyWhenSupported: true
  },
  corePlugins: {
    fontSize: false
  },
  theme: {
    screens: screens,
    colors: colors,
    fontFamily: {
      mono: [
        // Use a custom mono font for this site by changing 'JetBrains Mono' to the
        // font name you want and uncommenting the following line.
        "JetBrains Mono Variable",
        ...defaultTheme.fontFamily.mono
      ],
      serif: [
        // Use a custom sans serif font for this site by changing 'Lato' to the
        // font name you want and uncommenting the following line.
        "Bitter Variable",
        ...defaultTheme.fontFamily.serif
      ],
      sans: [
        // Use a custom sans serif font for this site by changing 'Lato' to the
        // font name you want and uncommenting the following line.
        "Poppins",
        ...defaultTheme.fontFamily.sans
      ],
      decorative: [
        // Use a custom sans serif font for this site by changing 'Lato' to the
        // font name you want and uncommenting the following line.
        "Geomanist",
        ...defaultTheme.fontFamily.sans
      ]
    },
    extend: {
      aspectRatio: {
        landscape: "3 / 2",
        portrait: "2 / 3",
        instagram: "4 / 5"
      },
      spacing: {
        // Used for the mobile navigation toggle.
        safe: "calc(env(safe-area-inset-bottom, 0rem) + 2rem)",
        fluid: "var(--col-gap)"
      },
      zIndex: {
        // Z-index stuff behind it's parent.
        behind: "-1"
      },
      gridTemplateColumns: {
        "blog-detail": "1fr 400px",
        cards: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
        "cards-xs": "repeat(auto-fit, minmax(min(120px, 100%), 1fr))",
        "cards-sm": "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
        "cards-md": "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
        "cards-lg": "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
        "cards-xl": "repeat(auto-fit, minmax(min(480px, 100%), 1fr))"
      },
      scale: {
        1025: "1.025"
      }
    }
  },
  plugins: [
    containerQueries,
    fluidType({
      settings: {
        fontSizeMin: 1.2, // 1.125rem === 18px
        fontSizeMax: 1.4, // 1.25rem === 20px
        ratioMin: 1.125, // Multiplicator Min
        ratioMax: 1.333, // Multiplicator Max
        screenMin: 20, // 20rem === 320px
        screenMax: 96, // 96rem === 1536px
        unit: "rem", // default is rem but it's also possible to use 'px'
        prefix: "", // set a prefix to use it alongside the default font sizes
        extendValues: true // When you set extendValues to true it will extend the default values. Set it to false to overwrite the values.
      },
      values: {
        "2xs": ["9px", 1.625],
        xs: ["12px", 1.625],
        sm: ["15px", 1.625],
        base: [0, 1.625],
        lg: [1, 1.5],
        xl: [2, 1.25],
        "2xl": [3, 1.25],
        "3xl": [4, 1.25],
        "4xl": [5, 1],
        "5xl": [6, 1],
        "6xl": [7, 1],
        "7xl": [8, 0.9],
        "8xl": [9, 0.9],
        "9xl": [10, 0.9],
        "10xl": [10, 0.8],
        "11xl": [11, 0.8]
      }
    }),
    plugin(function ({ addComponents, addUtilities, matchUtilities, addBase, theme }) {
      addBase({
        ":root": {
          // Fluid typography from 1 rem to 1.2 rem with fallback to 16px.
          fontSize: "100%",
          "font-size": "1rem", // to make it fluid: clamp(1rem, 1.6vw, 1.2rem)
          // Safari resize fix.
          minHeight: "0vw"
        },
        body: {
          color: theme("colors.neutral.600"),
          backgroundColor: theme("colors.white"),
          fontSize: theme("fontSizeFluid.base"),
          lineHeight: theme("lineHeight.relaxed"),
          scrollbarGutter: "stable",
          //--------------------------------------------------------------------------
          // Set sans, serif or mono stack with optional custom font as default.
          //--------------------------------------------------------------------------
          fontFamily: theme("fontFamily.serif")
          // fontFamily: theme("fontFamily.sans")
          // fontFamily: theme('fontFamily.serif'),
        }
      }),
        addComponents({
          // Fluid grid components.
          ":root": {
            "--col-min-padding": "0.5rem",
            "--col-max-padding": "4rem",
            "--col-fluidscale": "3vw",
            "--col-gap": "clamp(var(--col-min-padding), var(--col-fluidscale), var(--col-max-padding))",
            "--content-max-width": theme("screens.2xl"),
            "--popout": "0",
            "--col-width":
              "calc((min(calc(100% - var(--padding-left) - var(--padding-right) - 2 * var(--col-gap)), var(--content-max-width)) - 11 * var(--col-gap)) / 12)",
            "--padding-left":
              "clamp(calc(env(safe-area-inset-left, 0rem) + var(--col-min-padding)), var(--col-fluidscale), calc(env(safe-area-inset-left, 0rem) + var(--col-max-padding)))",
            "--padding-right":
              "clamp(calc(env(safe-area-inset-right, 0rem) + var(--col-min-padding)), var(--col-fluidscale), calc(env(safe-area-inset-right, 0rem) + var(--col-max-padding)))",
            "--side-width": "minmax(0, 1fr)"
          },
          ".fluid-grid": {
            display: "grid",
            columnGap: "var(--col-gap)",
            gridTemplateColumns:
              "[full-start] var(--side-width) [popout-start] var(--popout) [content-start col-1] var(--col-width) [col-2] var(--col-width) [col-3] var(--col-width) [col-4] var(--col-width) [col-5] var(--col-width) [col-6] var(--col-width) [col-7] var(--col-width) [col-8] var(--col-width) [col-9] var(--col-width) [col-10] var(--col-width) [col-11] var(--col-width) [col-12] var(--col-width) [content-end] var(--popout) [popout-end] var(--side-width) [full-end]"
          },
          ".meshGradient2": {
            backgroundColor: "#99ecff",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundImage: `radial-gradient(at 23% 35%, hsla(297,91%,65%,1) 0px, transparent 50%),
            radial-gradient(at 72% 99%, hsla(71,68%,77%,1) 0px, transparent 50%),
            radial-gradient(at 70% 10%, hsla(290,83%,65%,1) 0px, transparent 50%),
            radial-gradient(at 62% 48%, hsla(73,81%,63%,1) 0px, transparent 50%),
            radial-gradient(at 63% 36%, hsla(254,89%,64%,1) 0px, transparent 50%),
            radial-gradient(at 28% 43%, hsla(10,89%,79%,1) 0px, transparent 50%),
            radial-gradient(at 19% 57%, hsla(35,96%,65%,1) 0px, transparent 50%);`
          },
          ".meshGradient": {
            backgroundColor: "hsla(340,65%,14%,1)",
            backgroundImage: `radial-gradient(at 74% 3%, hsla(195,100%,50%,0.3) 0px, transparent 50%),
      radial-gradient(at 0% 1%, hsla(0,61%,51%,0.2) 0px, transparent 50%),
      radial-gradient(at 100% 100%, hsla(288,100%,50%,0.2) 0px, transparent 50%);`
          }
        }),
        // Add fluid grid utilities.
        addUtilities({
          ".span-content, .span-md, .span-lg, .span-xl": {
            gridColumn: "content"
          },
          ".span-popout": {
            gridColumn: "popout"
          },
          ".span-full": {
            gridColumn: "full"
          },
          "@media screen(md)": {
            ".span-md": {
              gridColumn: "col-3 / span 8"
            },
            ".span-lg": {
              gridColumn: "col-2 / span 10"
            },
            ".span-xl": {
              gridColumn: "col-1 / span 12"
            }
          },
          "@media screen(lg)": {
            ".span-md": {
              gridColumn: "col-4 / span 6"
            },
            ".span-lg": {
              gridColumn: "col-3 / span 8"
            },
            ".span-xl": {
              gridColumn: "col-2 / span 10"
            }
          }
        }),
        // Stack utilities.
        matchUtilities(
          {
            stack: (value) => ({
              "> *": {
                "--stack-space": value
              },
              "> *:not(.no-space-y, .no-space-b) + *:not(.no-space-y, .no-space-t)": {
                "margin-block-start": `var(--stack-item-space, var(--stack-space, ${theme("spacing.16")}))`
              }
            }),
            "stack-space": (value) => ({
              "--stack-item-space": value,
              '&:is([class*="stack-"][class*="stack-space-"] > *)': {
                "--stack-item-space": value
              }
            })
          },
          { values: theme("spacing") }
        ),
        addUtilities({
          '[class*="stack-"][class*="stack-space-"]': {
            "& > *": {
              "--stack-item-space": "initial"
            }
          },
          ".stack-space-inherit": {
            "--stack-item-space": "initial",
            '&:is([class*="stack-"][class*="stack-space-"] > *)': {
              "--stack-item-space": "initial"
            }
          },
          "*:is(.stack-space-collapse) + *:is(.stack-space-collapse)": {
            "--stack-item-space": 0
          }
        });
    })
  ]
};
