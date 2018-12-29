import {logger} from '../utils/_logger';
import {browser} from 'webextension-polyfill-ts';
import {WindowToPinnedTabMap} from '../controllers/_pinned-tabs';

export const PINNED_STORAGE_KEY = 'pinned-tabs';
export const PINNED_STATE_STORAGE_KEY = 'pinned-tabs-state';

export async function getUrlsToPin(): Promise<string[]> {
  const result = await browser.storage.sync.get(PINNED_STORAGE_KEY);
  if (result[PINNED_STORAGE_KEY]) {
    return result[PINNED_STORAGE_KEY];
  }

  return [];
}

export async function setUrlsToPin(urls: string[]) {
  await browser.storage.sync.set({
    [PINNED_STORAGE_KEY]: urls,
  });
}

export async function getPinnedState(): Promise<WindowToPinnedTabMap> {
  const result = await browser.storage.sync.get(PINNED_STATE_STORAGE_KEY);
  if (result[PINNED_STATE_STORAGE_KEY]) {
    return result[PINNED_STATE_STORAGE_KEY];
  }
  return {};
}

export async function setPinnedState(state: WindowToPinnedTabMap) {
  await browser.storage.sync.set({
    [PINNED_STATE_STORAGE_KEY]: state,
  });
}
