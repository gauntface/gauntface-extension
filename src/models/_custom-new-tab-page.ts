import {logger} from '../utils/_logger';
import {browser} from 'webextension-polyfill-ts';

export const CUSTOM_NEW_TAB_KEY = 'use-custom-new-tab-page';

export async function getUseCustomTabPage(): Promise<boolean> {
  const result = await browser.storage.sync.get(CUSTOM_NEW_TAB_KEY);
  if (result[CUSTOM_NEW_TAB_KEY]) {
    return result[CUSTOM_NEW_TAB_KEY];
  }

  return false;
}
