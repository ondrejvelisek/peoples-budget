import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import Navigation from "../components/Navigation/Navigation";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import mainCss from "../main.css?url";
import manifest from "../manifest.json?url";

import { StrictMode } from "react";
import { seo } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRoute({
  component: RootComponent,
  meta: () => [
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
  links: () => [
    { rel: "manifest", href: manifest },
    { rel: "stylesheet", href: mainCss },
  ],
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
