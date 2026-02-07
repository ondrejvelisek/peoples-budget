/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRouteWithContext,
  retainSearchParams,
} from "@tanstack/react-router";
import Navigation from "../components/Navigation/Navigation";
import { init } from "@plausible-analytics/tracker";

import mainCss from "../main.css?url";
import manifest from "../manifest.json?url";

import { StrictMode } from "react";
import { seo } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { QueryClient } from "@tanstack/react-query";
import { NotFound } from "./NotFound";
import { createIsomorphicFn } from "@tanstack/react-start";
import ogImage from "./hero-img-square.jpg";

createIsomorphicFn().client(() =>
  init({
    domain: "lidovyrozpocet.cz",
    endpoint: "/vercel-rewrite/api/event",
  })
)();

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      { name: "mobile-web-app-capable", content: "yes" },
      ...seo({
        title:
          "Lidový rozpočet | Státní rozpočet České republiky ve Vašich rukou",
        description: `Prozkoumejte státní rozpočet do poslední koruny.
      Lidový rozpočet je interaktivní aplikace,
      která Vám umožní prozkoumat státní rozpočet České republiky a zjistit, kam putují.
      Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte své nápady a názory s ostatními.`,
        keywords:
          "Lidový rozpočet, Rozpočet lidu, Rozpočet národa, rozpočet, státní rozpočet, finance, peníze, česká republika, interaktivní, výdaje, příjmy",
        image: ogImage,
      }),
    ],
    links: [
      { rel: "manifest", href: manifest },
      { rel: "stylesheet", href: mainCss },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "canonical",
        href: "https://lidovyrozpocet.cz",
      },
    ],
  }),
  notFoundComponent: NotFound,
  search: {
    middlewares: [retainSearchParams(["health"])],
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <TooltipProvider>
        <Navigation>
          <Outlet />
        </Navigation>
      </TooltipProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
