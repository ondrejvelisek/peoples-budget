import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig(
  {
    ignores: ["**/dist/", "**/.vinxi/", "**/.output/", "**/.vercel/"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat["recommended"] ?? {},
  pluginReact.configs.flat["jsx-runtime"] ?? {},
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...reactHooks.configs["flat/recommended"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(tailwind.configs["flat/recommended"] as any),
  {
    settings: {
      tailwindcss: {
        // These are the default values but feel free to customize
        callees: ["cn"],
        config: "tailwind.config.ts", // returned from `loadConfig()` utility if not provided
        removeDuplicates: true,
      },
    },
  },
  {
    files: ["**/app/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react/prop-types": "off",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-contradicting-classname": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
    },
  }
);
