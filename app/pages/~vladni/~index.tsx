import { createFileRoute, notFound } from "@tanstack/react-router";
import * as z from "zod/mini";

export const Route = createFileRoute("/vladni/")({
  loader() {
    // we want to keep thisroute to be able to use it in Link coponent so it highlights when it is active
    throw notFound();
  },
  validateSearch: z.object({
    health: z._default(z.boolean(), true),
  }),
});
