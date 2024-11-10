import {
  getCookie as getServerCookie,
  getResponseHeader,
  setCookie as setServerCookie,
} from "vinxi/http?server";

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
  if (import.meta.env.SSR) {
    const value = getServerCookie(name);

    const setValue: SetCookie = (newValue, options) => {
      // this deduplicates setting the cookie mulitple times
      const setCookieHeader = getResponseHeader("set-cookie");
      const deduplicate = options?.deduplicate ?? true;
      if (
        !deduplicate ||
        (newValue !== value &&
          (!setCookieHeader ||
            (typeof setCookieHeader === "object" &&
              setCookieHeader.length === 0)))
      ) {
        const maxAge = options?.maxAge ?? 60 * 60 * 24 * 30;
        setServerCookie(name, newValue, { maxAge });
      }
    };
    return [value, setValue] as const;
  } else if (isComponentRender()) {
    const [value, setClientValue] = useClientCookie(name);
    const setValue: SetCookie = (newValue, options) => {
      const deduplicate = options?.deduplicate ?? true;
      if (!deduplicate || newValue !== value) {
        const days = options?.maxAge ? options?.maxAge / 60 / 60 / 24 : 30;
        setClientValue(newValue, { days });
      }
    };
    return [value, setValue] as const;
  } else {
    const value = getClientCookie(name);

    const setValue: SetCookie = (newValue, options) => {
      const deduplicate = options?.deduplicate ?? true;
      if (!deduplicate || newValue !== value) {
        const days = options?.maxAge ? options?.maxAge / 60 / 60 / 24 : 30;
        setClientCookie(name, newValue, { days });
      }
    };

    return [value, setValue] as const;
  }
}

export const isComponentRender = () => {
  try {
    useEffect(() => {
      console.debug("isComponentRender: true");
    });
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    console.debug("isComponentRender: false");
    return false;
  }
};
