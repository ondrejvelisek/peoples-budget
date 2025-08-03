import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { isoImport } from "vite-plugin-iso-import";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    isoImport(),
    tanstackStart({
      customViteReactPlugin: true,
      target: "vercel",
      tsr: {
        srcDirectory: "./app/",
        routesDirectory: "./app/pages/",
        generatedRouteTree: "./app/routeTree.gen.ts",
        routeFilePrefix: "~",
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
      },

      prerender: {
        enabled: true,
        crawlLinks: true,
        // we do not want to prerender whole tree of budget explorer pages
        filter: ({ path }) =>
          !path.match(/^\/vladni\/[^/\n]+\/[^/\n]+\/[^\n]+$/),
      },
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});
