import {logger} from '../utils/logger';
import {browser} from 'webextension-polyfill-ts';

export async function getPopupURLs(): Promise<string[]> {
  const result = await browser.storage.sync.get('popup-urls');
  if (result['popup-urls']) {
    return result['popup-urls'];
  }

  return [];
}

export async function setPopupURLs(urls: string[]) {
  await browser.storage.sync.set({
    'popup-urls': urls,
  });
}
