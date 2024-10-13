import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint, { config } from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";

export default config(
  {
    ignores: ["**/dist/", "**/.vinxi/", "**/.output/", "**/.vercel/"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  ...tailwind.configs["flat/recommended"],
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
