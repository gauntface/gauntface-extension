import { browser } from 'webextension-polyfill-ts';
import {logger} from '../utils/_logger';
import {getUrlsToPin, getPinnedState, setPinnedState} from '../models/_pinned-tabs';

export type WindowToPinnedTabMap = {
  [windowID: number]: {
    [url: string]: number
  }
}

let pinnedTabs: WindowToPinnedTabMap = {};

let promiseChain = getPinnedState().then((prevState) => {
  pinnedTabs = prevState;
});

export async function getConfiguredWindows(): Promise<number[]> {
  await promiseChain;
  const windowIDs: number[] = [];
  Object.keys(pinnedTabs).map((key) => {
    try {
      windowIDs.push(parseInt(key, 10));
    } catch (err) {
      // NOOP
    }
  });
  return windowIDs;
}

export function configurePinnedTabs(windowID: number): Promise<void> {
  logger.log(`Configuring tabs in window ${windowID}, currrent config: `, pinnedTabs[windowID]);
  // Forrce a promise chain so steps don't interfere with multiple events
  // and calls causing updates.
  promiseChain = promiseChain.then(async () => {
    const urlsToPin = await getUrlsToPin();
    const currentlyManagedTabs = pinnedTabs[windowID] || {};

    // Instantiate and update any current tabs.
    try {
      for (let i = 0; i < urlsToPin.length; i++) {
        const url = urlsToPin[i];

        const currentTabID = currentlyManagedTabs[url];
        let currentTab = null;
        if (currentTabID) {
          try {
            currentTab = await browser.tabs.get(currentTabID);
          } catch (err) {
            // NOOP
          }
        }

        if (currentTab) {
          await browser.tabs.move(currentTab.id, {
            // Position in a specific order
            index: i,
          });
        } else {
          currentTab = await browser.tabs.create({
            // Don't force focus on it.
            active: false,
            // Position in a specific order
            index: i,
            // Ensure it's pinned
            pinned: true,
            // Provide URL of the tab
            url,
          });
        }
        currentlyManagedTabs[url] = currentTab.id
      }
    } catch (err) {
      logger.error(err);
    }

    // Delete any open tabs we are controlling.
    try {
      for (const tabUrl of Object.keys(currentlyManagedTabs)) {
        if (urlsToPin.indexOf(tabUrl) === -1) {
          logger.debug(`Removing old tab with URL ${tabUrl}`);
          await browser.tabs.remove(currentlyManagedTabs[tabUrl]);
        }
      }
    } catch (err) {
      logger.error(err);
    }
    pinnedTabs[windowID] = currentlyManagedTabs;
    await setPinnedState(pinnedTabs);
  });
  return promiseChain;
}
