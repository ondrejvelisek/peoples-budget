import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "./Navbar";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import mainCss from "../main.css?url";

import { StrictMode } from "react";

export const Route = createRootRoute({
  component: RootComponent,
  links: () => [{ rel: "stylesheet", href: mainCss }],
});

function RootComponent() {
  return (
    <RootDocument>
      <Navbar />
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Html>
        <Head>
          <Meta />
        </Head>
        <Body>
          {children}
          <ScrollRestoration />
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </Body>
      </Html>
    </StrictMode>
  );
}
