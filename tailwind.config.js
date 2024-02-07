/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"
import { fontFamily } from "tailwindcss/defaultTheme"

export const darkMode = ["class"]
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
  "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}" // Tremor module
]
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px"
    }
  },
  fontFamily: {
    display: ["var(--font-outfit)"],
    sans: ["var(--font-inter)", ...fontFamily.sans]
  },
  transparent: "transparent",
  current: "currentColor",
  extend: {
    colors: {
      gray: colors.stone,
      // light mode
      tremor: {
        brand: {
          faint: "#eff6ff", // blue-50
          muted: "#bfdbfe", // blue-200
          subtle: "#60a5fa", // blue-400
          DEFAULT: "#3b82f6", // blue-500
          emphasis: "#1d4ed8", // blue-700
          inverted: "#ffffff" // white
        },
        background: {
          muted: "#fafaf9", // gray-50
          subtle: "#f5f5f4", // gray-100
          DEFAULT: "#ffffff", // white
          emphasis: "#44403c" // gray-700
        },
        border: {
          DEFAULT: "#e7e5e4" // gray-200
        },
        ring: {
          DEFAULT: "#e7e5e4" // gray-200
        },
        content: {
          subtle: "#a8a29e", // gray-400
          DEFAULT: "#78716c", // gray-500
          emphasis: "#44403c", // gray-700
          strong: "#1c1917", // gray-900
          inverted: "#ffffff" // white
        }
      },
      // dark mode
      "dark-tremor": {
        brand: {
          faint: "#0B1229", // custom
          muted: "#172554", // blue-950
          subtle: "#1e40af", // blue-800
          DEFAULT: "#3b82f6", // blue-500
          emphasis: "#60a5fa", // blue-400
          inverted: "#0c0a09" // gray-950
        },
        background: {
          muted: "#131A2B", // custom
          subtle: "#292524", // gray-800
          DEFAULT: "#1c1917", // gray-900
          emphasis: "#d6d3d1" // gray-300
        },
        border: {
          DEFAULT: "#292524" // gray-800
        },
        ring: {
          DEFAULT: "#292524" // gray-800
        },
        content: {
          subtle: "#57534e", // gray-600
          DEFAULT: "#78716c", // gray-500
          emphasis: "#e7e5e4", // gray-200
          strong: "#fafaf9", // gray-50
          inverted: "#000000" // black
        }
      },
      // cargo brand colors https://www.tints.dev/brand/FF7100
      brand: {
        50: "color(display-p3 1 0.945 0.898 / <alpha-value>)",
        100: "color(display-p3 1 0.89 0.8 / <alpha-value>)",
        200: "color(display-p3 1 0.78 0.6 / <alpha-value>)",
        300: "color(display-p3 1 0.671 0.4 / <alpha-value>)",
        400: "color(display-p3 1 0.561 0.2 / <alpha-value>)",
        500: "color(display-p3 1 0.443 0 / <alpha-value>)",
        600: "color(display-p3 0.8 0.361 0 / <alpha-value>)",
        700: "color(display-p3 0.6 0.271 0 / <alpha-value>)",
        800: "color(display-p3 0.4 0.18 0 / <alpha-value>)",
        900: "color(display-p3 0.2 0.09 0 / <alpha-value>)",
        950: "color(display-p3 0.098 0.043 0 / <alpha-value>)"
      }
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" }
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 }
      },
      "border-beam": {
        "100%": {
          "offset-distance": "100%"
        }
      }
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "border-beam": "border-beam calc(var(--duration)*1s) infinite linear"
    },
    boxShadow: {
      // light
      "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "tremor-card":
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "tremor-dropdown":
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      // dark
      "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "dark-tremor-card":
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "dark-tremor-dropdown":
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    },
    borderRadius: {
      "tremor-small": "0.375rem",
      "tremor-default": "0.5rem",
      "tremor-full": "9999px"
    },
    fontSize: {
      "tremor-label": ["0.75rem"],
      "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
      "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
      "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }]
    }
  }
}

export const safelist = [
  {
    pattern:
      /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"]
  },
  {
    pattern:
      /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"]
  },
  {
    pattern:
      /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    variants: ["hover", "ui-selected"]
  },
  {
    pattern:
      /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  },
  {
    pattern:
      /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  },
  {
    pattern:
      /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  }
]

export const plugins = [require("tailwindcss-animate")]
