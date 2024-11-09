import { createServerFn } from "@tanstack/start";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {
  getCookie,
  getRequestURL,
  isPreflightRequest,
  setCookie,
} from "vinxi/http?server";

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

export const logEvent = createServerFn(
  "POST",
  async ({ type, page }: { type: EventType; page: string }) => {
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

    let session = getCookie("session");
    if (!session) {
      session = randomString();
    }
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

    await doc.loadInfo();
    const eventsSheet = doc.sheetsByTitle["events"];
    await eventsSheet?.addRow(event);
  }
);

function randomString(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
