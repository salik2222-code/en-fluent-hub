/**
 * CRM Bridge — Google Sheets integration.
 *
 * Two ways to mirror student activity to a Google Sheet:
 *
 * 1) Lovable Google Sheets connector (recommended, OAuth, no manual link).
 *    Set SHEET_ID and the edge function `crm-log` will append rows there.
 *
 * 2) Custom Google Apps Script Web App webhook — paste your deployed URL below.
 */
export const GOOGLE_SHEET_CRM_URL = "YOUR_LINK_HERE";

/** ID of the Google Sheet to append rows to (used by `crm-log` edge function). */
export const GOOGLE_SHEET_ID = "YOUR_SHEET_ID_HERE";

/** Tab/range inside the sheet — e.g. `Activities!A:F`. */
export const GOOGLE_SHEET_RANGE = "Activities!A:G";
