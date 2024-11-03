import { getCookie, getResponseHeader, setCookie } from "vinxi/http?server";
import Cookies from "js-cookie";

import useClientCookie from "react-use-cookie";
import { useEffect } from "react";

export function accessCookie(
  name: string
): [string | undefined, (value: string) => void] {
  if (import.meta.env.SSR) {
    const value = getCookie(name);

    function setValue(newValue: string) {
      // this deduplicates setting the cookie mulitple times
      const setCookieHeader = getResponseHeader("set-cookie");
      if (
        newValue !== value &&
        (!setCookieHeader ||
          (typeof setCookieHeader === "object" && setCookieHeader.length === 0))
      ) {
        setCookie(name, newValue);
      }
    }
    return [value, setValue] as const;
  } else if (isComponentRender()) {
    const [value, setClientValue] = useClientCookie(name);
    function setValue(newValue: string) {
      if (newValue !== value) {
        setClientValue(newValue);
      }
    }
    return [value, setValue] as const;
  } else {
    const value = Cookies.get(name);

    function setValue(newValue: string) {
      if (newValue !== value) {
        Cookies.set(name, newValue);
      }
    }

    return [value, setValue] as const;
  }
}

export const isComponentRender = () => {
  try {
    useEffect(() => {
      console.debug("isComponentRender: true");
    });
    return true;
  } catch (e) {
    console.debug("isComponentRender: false; error", e);
    return false;
  }
};
