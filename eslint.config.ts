import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint, { config } from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default config(
  {
    ignores: ["**/dist/"],
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
  }
);
