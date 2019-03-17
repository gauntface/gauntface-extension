import {logger} from '../utils/_logger';
import {browser} from 'webextension-polyfill-ts';

export const URLS_TO_PIN_STORAGE_KEY = 'pinned-tabs';
export const PINNED_TABS_STORAGE_KEY = 'pinned-tabs-state';

export type WindowToPinnedTabMap = {
  [windowID: number]: {
    [url: string]: PinnedTabInfo
  }
}

export type PinnedTabInfo = {
  finalURL: string
  latestTabID: number
}

export async function getUrlsToPin(): Promise<string[]> {
  const result = await browser.storage.sync.get(URLS_TO_PIN_STORAGE_KEY);
  if (result[URLS_TO_PIN_STORAGE_KEY]) {
    return result[URLS_TO_PIN_STORAGE_KEY];
  }

  return [];
}

export async function setUrlsToPin(urls: string[]) {
  await browser.storage.sync.set({
    [URLS_TO_PIN_STORAGE_KEY]: urls,
  });
}

export async function getPinnedTabsInfo(): Promise<WindowToPinnedTabMap> {
  const result = await browser.storage.sync.get(PINNED_TABS_STORAGE_KEY);
  if (result[PINNED_TABS_STORAGE_KEY]) {
    return result[PINNED_TABS_STORAGE_KEY];
  }
  return {};
}

export async function setPinnedTabsInfo(state: WindowToPinnedTabMap) {
  await browser.storage.sync.set({
    [PINNED_TABS_STORAGE_KEY]: state,
  });
}
