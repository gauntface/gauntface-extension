import { Windows, Tabs, browser } from "webextension-polyfill-ts";
import {logger} from '../utils/logger';
import { configurePinnedTabs, getConfiguredWindows } from "./pinned-tabs";

export async function updateAllWindows() {
  logger.debug('Updating all windows');
  const configuredWindowIDs = getConfiguredWindows();
  for (const windowID of configuredWindowIDs) {
    try {
      const window = await browser.windows.get(windowID);
      if (window.type !== 'normal') {
        continue;
      }
      const tabs = await browser.tabs.query({
        windowId: window.id,
        pinned: true,
      });

      // If the window has no tabs - it's likely a new window and should be altered.
      await configurePinnedTabs(window.id);
    } catch (err) {
      // NOOP
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
