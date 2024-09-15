import "./main.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { colorsTuple, createTheme, MantineProvider } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";
import { mapValues, omit } from "lodash";
import { StrictMode } from "react";

const { theme: tailwindTheme } = resolveConfig(tailwindConfig);

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const tailwindColors = omit(tailwindTheme.colors, [
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
]);

const tailwindMantineTheme = {
  colors: mapValues(tailwindColors, (colorValue) => {
    if (typeof colorValue === "string") {
      return colorsTuple(colorValue);
    } else {
      return colorsTuple(Object.values(colorValue));
    }
  }),
  luminanceThreshold: 0.35,
} as const;

const theme = createTheme(tailwindMantineTheme);

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);

type ExtendedCustomColors = keyof (typeof tailwindMantineTheme)["colors"];

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
