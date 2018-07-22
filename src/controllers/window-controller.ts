import { Windows, Tabs, browser } from "webextension-polyfill-ts";
import {logger} from '../utils/logger';
import { configurePinnedTabs } from "./pinned-tabs";

export async function updateAllWindows() {
  logger.debug('Updating all windows');
  const allWindows = await browser.windows.getAll();
  for (const window of allWindows) {
    if (window.type !== 'normal') {
      return;
    }
    await configurePinnedTabs(window.id);
  }
}

export async function onWindowCreated(window: Windows.Window) {
  logger.debug('New window created');
  if (window.type === 'normal') {
    const tabs = await browser.tabs.query({
      windowId: window.id,
    });
    logger.debug('Checking tabs in new window: ', tabs);
    if (tabs.length === 0 || tabs[0].url === 'chrome://newtab/') {
      await configurePinnedTabs(window.id);
    }
  }
}

export async function onTabCreated(tab: Tabs.Tab) {
  await configurePinnedTabs(tab.windowId);
}

export async function onTabUpdated(tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) {
  if (tab.status === 'complete' && tab.pinned) {
    logger.log('Tab updated: ', tab);
    await configurePinnedTabs(tab.windowId);
  }
}
