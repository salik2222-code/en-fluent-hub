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
export const GOOGLE_SHEET_CRM_URL =
  "https://docs.google.com/spreadsheets/d/1VqcY_evHEFpWIdDFKw6eQKBr35Dsycj-ZdB7OSEJ1IA";

/** ID of the "E Speak List" Google Sheet (used by `crm-log` edge function). */
export const GOOGLE_SHEET_ID = "1VqcY_evHEFpWIdDFKw6eQKBr35Dsycj-ZdB7OSEJ1IA";

/** Columns: A=Name, B=Email, C=Activity, D=Score, E=Date */
export const GOOGLE_SHEET_RANGE = "Sheet1!A:E";
