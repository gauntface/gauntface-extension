import { browser, Runtime, Storage } from 'webextension-polyfill-ts';
import {updateAllWindows} from './_window-controller';
import {logger} from '../utils/_logger';
import { configurePanels } from './_panels';
import {PINNED_STORAGE_KEY, PINNED_STATE_STORAGE_KEY} from '../models/_pinned-tabs';
import {POPUP_STORAGE_KEY} from '../models/_popup-urls';

async function logTabs() {
  const tabs = await browser.tabs.query({
    currentWindow: true,
  });
  for (const t of tabs) {
    console.log(`    ${t.id}: ${t.url}`);
  }
}

export async function onExtensionStartup() {
  const waitS = 30;
  logger.log(`onExtensionStartup() Waiting ${waitS} seconds....`);
  logger.log(`Tabs at boot.....`);
  await logTabs();

  setTimeout(async () => {
    logger.log(`onExtensionStartup() Running.....`);

    logger.log(`Tabs before hand.....`);
    await logTabs();

    await updateAllWindows();
    await configurePanels();

    logger.log(`Tabs after hand.....`);
    await logTabs();
  }, waitS * 1000);
}

export async function onInstalled(details: Runtime.OnInstalledDetailsType) {
  logger.log(`onInstalled() reason: ${details.reason}`);
  if (details.reason === 'install') {
    await browser.runtime.openOptionsPage();
  }
}

export async function onStorageChange(changes: Storage.OnChangedChangesType, areaName: string) {
  for (const changeKey of Object.keys(changes)) {
    logger.log(`onStorageChange() changeKey: ${changeKey}`);
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
