import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { isoImport } from "vite-plugin-iso-import";

export default defineConfig({
  server: {
    preset: "vercel",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      // we do not want to prerender whole tree of budget explorer pages
      ignore: [/^\/vladni\/[^/\n]+\/[^/\n]+\/[^\n]+$/],
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
