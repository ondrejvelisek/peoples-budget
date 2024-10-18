import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import mainCss from "../main.css?url";

import { StrictMode } from "react";
import { useExpensesData } from "@/data/expenses";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
  links: () => [{ rel: "stylesheet", href: mainCss }],
});

function RootComponent() {
  return (
    <RootDocument>
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
          <Scripts />
        </Body>
      </Html>
    </StrictMode>
  );
}
