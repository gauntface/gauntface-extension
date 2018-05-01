import { browser, Runtime, Storage } from 'webextension-polyfill-ts';
import {updateAllWindows} from './window-controller';
import {logger} from '../utils/logger';
import { configurePanels } from './panels';
import {PINNED_STORAGE_KEY} from '../models/pinned-tabs';
import {POPUP_STORAGE_KEY} from '../models/popup-urls';

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
      default:
        logger.warn(`An untracked storage change occured on '${changeKey}'`, changes, areaName);
    }
  }
}
