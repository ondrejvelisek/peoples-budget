import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { isoImport } from "vite-plugin-iso-import";
import { nitro } from "nitro/vite";

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
      srcDirectory: "./app/",
      router: {
        routesDirectory: "./pages/",
        generatedRouteTree: "./routeTree.gen.ts",
        routeFilePrefix: "~",
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
      },
      prerender: {
        enabled: false,
        crawlLinks: true,
        // we do not want to prerender whole tree of budget explorer pages
        filter: ({ path }) =>
          !path.match(/^\/vladni\/[^/\n]+\/[^/\n]+\/[^\n]+$/) &&
          !path.match(/^\/compare.*$/),
      },
    }),
    nitro({
      config: {
        preset: "vercel",
        replace: {
          "typeof window": "`undefined`",
        },
      },
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});
