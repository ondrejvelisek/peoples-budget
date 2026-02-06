import { createFileRoute } from "@tanstack/react-router";
import { DonationProgressWidget } from "./DonationProgressWidget";
import supportProjectImg from "./support-project-illustration.png";
import supportSuccessImg from "./support-project-success-illustration.png";
import { z } from "zod";
import { SupportWidget } from "./SupportWidget";
import { formatCurrencyStandard } from "@/lib/utils";

export const ANNUAL_COSTS = 41000;

export const Route = createFileRoute("/podporit/")({
  validateSearch: z.object({
    succeeded: z.boolean().optional(),
    payment_intent: z.string().optional(),
    payment_intent_client_secret: z.string().optional(),
    redirect_status: z
      .enum(["succeeded", "pending", "processing", "failed"])
      .optional(),
  }),
  component: Page,
});

function Page() {
  const { succeeded } = Route.useSearch();
  return (
    <div className="p-4 @container md:p-6 lg:p-10">
      <h1 className="whitespace-nowrap pb-3 text-4xl font-semibold md:text-5xl md:font-medium lg:text-6xl">
        {formatCurrencyStandard(ANNUAL_COSTS)} Kč ročně
      </h1>
      <p className="mb-4">
        tolik zhruba stojí provoz, údržba a rozvoj projektu Lidový rozpočet.
      </p>
      <div className="grid max-w-4xl grid-cols-1 items-center gap-8 @lg:grid-cols-2">
        <img
          src={succeeded ? supportSuccessImg : supportProjectImg}
          alt="Lev, maskot projektu Lidový rozpočet, smutně nahlížející do prázdné peněženky"
          className="mx-auto -mb-8 w-full max-w-sm"
        />
        <DonationProgressWidget className="-mx-1 max-w-lg rounded-lg border border-stone-50 p-4 shadow-lg shadow-sand-400/40" />
        <div className="max-w-lg">
          <p className="mb-4">
            Za projektem nestojí žádná velká firma ani instituce. Všechno platím
            sám, protože věřím, že pečovat o naše společné peníze má smysl.
          </p>
          <p className="mb-4">
            Z vybraných peněz zaplatím hosting a monitoring aplikace, doménu,
            vývojářské nástroje a část svého času.
          </p>
          <p className="">
            Pokud se vám myšlenka Lidového rozpočtu líbí a chcete ji vidět růst,
            přispějte prosím. Za každou Vaši podporu děkuji!
          </p>
        </div>
        <SupportWidget className="-mx-1 max-w-lg rounded-lg border border-stone-50 p-4 shadow-lg shadow-sand-400/40" />
      </div>
    </div>
  );
}
