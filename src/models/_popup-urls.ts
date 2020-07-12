import { logger } from "../utils/_logger";
import { browser } from "webextension-polyfill-ts";

export const POPUP_STORAGE_KEY = "popup-urls";

export async function getPopupURLs(): Promise<string[]> {
  const result = await browser.storage.sync.get(POPUP_STORAGE_KEY);
  if (result[POPUP_STORAGE_KEY]) {
    return result[POPUP_STORAGE_KEY];
  }

  return [];
}

export async function setPopupURLs(urls: string[]) {
  await browser.storage.sync.set({
    [POPUP_STORAGE_KEY]: urls,
  });
}
