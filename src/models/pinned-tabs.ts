import {logger} from '../utils/logger';
import {browser} from 'webextension-polyfill-ts';

export const PINNED_STORAGE_KEY = 'pinned-tabs';

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
