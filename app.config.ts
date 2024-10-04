import { defineConfig } from "@tanstack/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    prerender: {
      routes: ["/"],
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
    plugins: () => [tsconfigPaths()],
  },
});
