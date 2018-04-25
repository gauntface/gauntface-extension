import {logger} from '../utils/logger';
import {browser} from 'webextension-polyfill-ts';

export async function getUrlsToPin(): Promise<string[]> {
  const result = await browser.storage.sync.get('pinned-tabs');
  if (result['pinned-tabs']) {
    return result['pinned-tabs'];
  }

  return [];
}

export async function setUrlsToPin(urls: string[]) {
  await browser.storage.sync.set({
    'pinned-tabs': urls,
  });
}
