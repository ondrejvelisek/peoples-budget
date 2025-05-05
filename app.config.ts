import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { isoImport } from "vite-plugin-iso-import";

export default defineConfig({
  server: {
    preset: "vercel",
    prerender: {
      routes: ["/", "/2024/odvetvi", "/2024/druh", "/2024/urad"],
      crawlLinks: true,
      ignore: [/^\/(2024|2025)\/[^/\n]+\/[^\n]+$/],
    },
  },
  react: {
    babel: {
      plugins: ["babel-plugin-react-compiler"],
    },
  },
  tsr: {
    appDirectory: "./app/",
    routesDirectory: "./app/pages/",
    generatedRouteTree: "./app/routeTree.gen.ts",
    routeFilePrefix: "~",
    autoCodeSplitting: true,
    routeFileIgnorePrefix: "-",
    quoteStyle: "single",
  },
  vite: {
    plugins: [tsConfigPaths(), isoImport()],
  },
});
