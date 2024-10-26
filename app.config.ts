import { defineConfig } from "@tanstack/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "vercel",
    prerender: {
      routes: ["/", "/2024/odvetvi", "/2024/druh", "/2024/urad"],
      crawlLinks: true,
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
    plugins: [tsconfigPaths()],
  },
});
