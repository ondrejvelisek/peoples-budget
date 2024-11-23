import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import Navigation from "../components/Navigation/Navigation";
import { Meta, Scripts } from "@tanstack/start";

import mainCss from "../main.css?url";
import manifest from "../manifest.json?url";

import { StrictMode } from "react";
import { seo } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { QueryClient } from "@tanstack/react-query";

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
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "Rozpočet národa | Státní rozpočet České republiky ve Vašich rukou",
        description: `Prozkoumejte státní rozpočet do poslední koruny.
      Rozpočet národa je interaktivní aplikace,
      která Vám umožní prozkoumat státní rozpočet České republiky a zjistit, kam putují.
      Vyzkoušejte si, jak byste rozdělili peníze Vy! Sdílejte své nápady a názory s ostatními.`,
        keywords:
          "Lidový rozpočet, Rozpočet lidu, Rozpočet národa, rozpočet, státní rozpočet, finance, peníze, česká republika, interaktivní, výdaje, příjmy",
      }),
    ],
    links: [
      { rel: "manifest", href: manifest },
      { rel: "stylesheet", href: mainCss },
    ],
  }),
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
          <Meta />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
