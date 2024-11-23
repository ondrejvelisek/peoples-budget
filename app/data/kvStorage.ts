import { createStorage } from "unstorage";
import vercelKVDriver from "unstorage/drivers/vercel-kv";

export const kvStorage = createStorage({
  driver: vercelKVDriver({
    url: process.env["KV_REST_API_URL"],
    token: process.env["KV_REST_API_TOKEN"],
    ttl: 60 * 60 * 24 * 30, // 30 days
  }),
});
