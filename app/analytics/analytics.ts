import { accessCookie } from "@/data/cookie";
import { createServerFn } from "@tanstack/react-start";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {
  getRequestURL,
  isPreflightRequest,
} from "@tanstack/react-start/server";

const DOC_ID = process.env["SHEET_DOC_ID"];

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
  email: process.env["SHEET_USER_EMAIL"],
  key: process.env["SHEET_PRIVATE_KEY"],
  scopes: SCOPES,
});
const doc = DOC_ID ? new GoogleSpreadsheet(DOC_ID, jwt) : undefined;

export type EventType = "page-view" | "init-page";

export type Event = {
  timestamp: string; // epoch time in ms
  session: string; // anonymous temporal session id of a user
  origin: string; //  origin of the event
  type: EventType; // event type
  page: string; //  path of the event
};

export const logEvent = createServerFn({ method: "POST" })
  .validator((data: { type: EventType; page: string }) => data)
  .handler(({ data }) => {
    const { type, page } = data;
    if (!doc) {
      return;
    }
    if (process.env["CI"]) {
      return;
    }
    if (["/favicon.ico"].includes(page)) {
      return;
    }
    const isPreflight = isPreflightRequest();
    if (isPreflight) {
      return;
    }

    const [session, setSessionCookie] = accessCookie("session");
    if (!session) {
      // user navigates before JS was loaded. We track it when JS is loaded. See below.
      return;
    }

    setSessionCookie(session, {
      maxAge: 60 * 30, // 30 minutes
      deduplicate: false,
    });
    const url = getRequestURL();

    // Which datetime I want to sent to my analytics?
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Prague" })
    );
    const timestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, -1);

    const event: Event = {
      timestamp,
      session,
      origin: url.origin,
      type,
      page,
    };

    // dont block rendering page
    (async () => {
      await doc.loadInfo();
      const eventsSheet = doc.sheetsByTitle["events"];
      await eventsSheet?.addRow(event);
    })();
  });

function randomString(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// when JS is loaded in the browser
// set the cookie and send initial page-view event
if (!import.meta.env["SSR"]) {
  const [sessionCookie, setSessionCookie] = accessCookie("session");
  if (!sessionCookie) {
    setSessionCookie(randomString(), {
      maxAge: 60 * 30, // 30 minutes
      deduplicate: false,
    });
  }
  await logEvent({
    data: {
      type: "init-page",
      page: window.location.pathname + window.location.search,
    },
  });
}
