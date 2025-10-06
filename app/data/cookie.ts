import {
  getCookie as getServerCookie,
  getResponseHeader,
  setCookie as setServerCookie,
} from "@tanstack/react-start/server?server";

import useClientCookie, {
  setCookie as setClientCookie,
  getCookie as getClientCookie,
} from "react-use-cookie";
import { useEffect } from "react";

type CookieOptions = {
  maxAge?: number;
  deduplicate?: boolean;
};

type SetCookie = (value: string, options?: CookieOptions) => void;

export function accessCookie(name: string): [string | undefined, SetCookie] {
  if (import.meta.env["SSR"]) {
    const value = getServerCookie(name);

    const setValue: SetCookie = (newValue, options) => {
      // this deduplicates setting the cookie mulitple times
      const setCookieHeader = getResponseHeader("set-cookie");
      const deduplicate = options?.deduplicate ?? true;
      if (
        !deduplicate ||
        (newValue !== value &&
          (!setCookieHeader || setCookieHeader.length === 0))
      ) {
        const maxAge = options?.maxAge ?? 60 * 60 * 24 * 30;
        setServerCookie(name, newValue, { maxAge });
      }
    };
    return [value || undefined, setValue] as const;
  } else if (isComponentRender()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setClientValue] = useClientCookie(name);
    const setValue: SetCookie = (newValue, options) => {
      const deduplicate = options?.deduplicate ?? true;
      if (!deduplicate || newValue !== value) {
        const days = options?.maxAge ? options?.maxAge / 60 / 60 / 24 : 30;
        setClientValue(newValue, { days });
      }
    };
    return [value || undefined, setValue] as const;
  } else {
    const value = getClientCookie(name);

    const setValue: SetCookie = (newValue, options) => {
      const deduplicate = options?.deduplicate ?? true;
      if (!deduplicate || newValue !== value) {
        const days = options?.maxAge ? options?.maxAge / 60 / 60 / 24 : 30;
        setClientCookie(name, newValue, { days });
      }
    };

    return [value || undefined, setValue] as const;
  }
}

export const isComponentRender = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {}, []);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return false;
  }
};
