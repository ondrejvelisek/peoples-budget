import { createServerFn } from "@tanstack/start";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {
  getCookie,
  getRequestURL,
  isPreflightRequest,
  setCookie,
} from "vinxi/http?server";

const DOC_ID = "1jNTJM1S3h4OuSxngN06A5V2rC8j2Z25D-fojuPoMNhM";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

console.error("TEST1 process.env", process.env);

const jwt = new JWT({
  email: process.env["SHEET_USER_EMAIL"],
  key: process.env["SHEET_PRIVATE_KEY"],
  scopes: SCOPES,
});
const doc = new GoogleSpreadsheet(DOC_ID, jwt);

export type EventType = "page-view" | "init-page";

export type Event = {
  timestamp: string; // epoch time in ms
  session: string; // anonymous temporal session id of a user
  origin: string; //  origin of the event
  type: EventType; // event type
  page: string; //  path of the event
};

export const logEvent = createServerFn(
  "POST",
  async ({ type, page }: { type: EventType; page: string }) => {
    console.error("TEST2 process.env", process.env);
    if (["/favicon.ico"].includes(page)) {
      return;
    }
    const isPreflight = isPreflightRequest();
    if (isPreflight) {
      return;
    }
    let session = getCookie("session");
    console.error("sessionId", session);
    if (!session) {
      session = randomString();
    }
    console.error("sessionIdrandom", session);
    setCookie("session", session, {
      maxAge: 60 * 30, // 30 minutes
    });
    const url = getRequestURL();

    const now = new Date();
    const timestamp = now.toISOString().slice(0, -1);
    const event: Event = {
      timestamp,
      session,
      origin: url.origin,
      type,
      page,
    };

    console.error("event", event);

    await doc.loadInfo();
    const eventsSheet = doc.sheetsByTitle["events"];
    await eventsSheet?.addRow(event);
  }
);

function randomString(length = 16) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
