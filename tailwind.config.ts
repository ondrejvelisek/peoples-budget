import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";
import tailwindContainers from "@tailwindcss/container-queries";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx,html}"],
  plugins: [tailwindAnimate, tailwindScrollbar, tailwindContainers],
  theme: {
    extend: {
      backgroundImage: {
        "hero-img": `url('/hero-img.jpg')`,
        "hero-img-square": `url('/hero-img-square.jpg')`,
        "not-found-img": `url('/not-found-img.jpg')`,
        "diagonal-stripes":
          "repeating-linear-gradient(-45deg, #463E30 0 8px, transparent 8px 16px)",
      },
      borderRadius: {
        "2xl": "calc(var(--radius) + 6px)",
        xl: "calc(var(--radius) + 4px)",
        lg: "calc(var(--radius) + 2px)",
        md: "calc(var(--radius) + 0px)",
        sm: "calc(var(--radius) - 2px)",
      },
      colors: {
        sand: {
          50: "#FCF9F6",
          100: "#F8F2EA",
          150: "#F3ECE2",
          200: "#EDE5DA",
          300: "#DED5C7",
          350: "#C8BCAA",
          400: "#B3A38D",
          450: "#978973",
          500: "#7B6E58",
          600: "#5C5241",
          700: "#463E30",
          800: "#2B261E",
          900: "#1F1B15",
          950: "#14100D",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      transitionDuration: {
        "600": "600ms",
        "800": "800ms",
        "5000": "5000ms",
        "15000": "15000ms",
      },
      transitionTimingFunction: {
        snap: "linear(0, 0.031 2.2%, 0.13 4.8%, 0.89 18.6%, 1.027 22.8%, 1.105 27.4%, 1.119 34.4%, 0.988 58.6%, 1)",
      },
      dropShadow: {
        "white-top-right": ["-1px -1px 0 white"],
      },
    },
  },
} satisfies Config;
