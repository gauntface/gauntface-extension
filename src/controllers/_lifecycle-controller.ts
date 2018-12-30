import { browser, Runtime, Storage } from 'webextension-polyfill-ts';
import {updateAllWindows} from './_window-controller';
import {logger} from '../utils/_logger';
import { configurePanels } from './_panels';
import {PINNED_STORAGE_KEY, PINNED_STATE_STORAGE_KEY} from '../models/_pinned-tabs';
import {POPUP_STORAGE_KEY} from '../models/_popup-urls';

export async function onExtensionStartup() {
  await updateAllWindows();
  await configurePanels();
}

export async function onInstalled(details: Runtime.OnInstalledDetailsType) {
  if (details.reason === 'install') {
    await browser.runtime.openOptionsPage();
  }
}

export async function onStorageChange(changes: Storage.OnChangedChangesType, areaName: string) {
  for (const changeKey of Object.keys(changes)) {
    switch (changeKey) {
      case PINNED_STORAGE_KEY:
        await updateAllWindows();
        break;
      case POPUP_STORAGE_KEY:
        await configurePanels();
        break;
      case PINNED_STATE_STORAGE_KEY:
        // NOOP
        break;
      default:
        logger.warn(`An untracked storage change occured on '${changeKey}'`, changes, areaName);
    }
  }
}
