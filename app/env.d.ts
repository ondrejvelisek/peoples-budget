/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SHEET_USER_EMAIL: string;
      SHEET_PRIVATE_KEY: string;
      SHEET_DOC_ID: string;

      KV_URL: string;
      KV_REST_API_READ_ONLY_TOKEN: string;
      KV_REST_API_TOKEN: string;
      KV_REST_API_URL: string;

      STRIPE_SECRET_KEY: string;
      VITE_STRIPE_PUBLISHABLE_KEY: string;
    }
  }
}

export {};
