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
    const tabs = await browser.tabs.query({
      windowId: window.id,
      pinned: true,
    });

    // If the window has no tabs - it's likely a new window and should be altered.
    if (tabs.length > 0) {
      await configurePinnedTabs(window.id);
    }
  }
}

export async function onWindowCreated(window: Windows.Window) {
  if (window.type === 'normal') {
    logger.debug('New window created');
    
    const tabs = await browser.tabs.query({
      windowId: window.id,
    });

    if (tabs.length === 0 || tabs[0].url === 'chrome://newtab/') {
      logger.log(`Configuring tabs in new window: `, window);
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
