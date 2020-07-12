import { browser } from "webextension-polyfill-ts";
import { logger } from "../utils/_logger";
import {
  getUrlsToPin,
  getPinnedTabsInfo,
  setPinnedTabsInfo,
  WindowToPinnedTabMap,
  PinnedTabInfo,
} from "../models/_pinned-tabs";

export async function getConfiguredWindows(): Promise<number[]> {
  const pinnedTabs = await getPinnedTabsInfo();

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

export async function configurePinnedTabs(windowID: number): Promise<void> {
  const pinnedTabs = await getPinnedTabsInfo();

  logger.log(
    `Configuring tabs in window ${windowID}, currrent config: `,
    pinnedTabs[windowID]
  );

  const urlsToPin = await getUrlsToPin();
  const currentlyManagedTabs = pinnedTabs[windowID] || {};

  // Instantiate and update any current tabs.
  try {
    const missingTabs: string[] = [];
    for (let i = 0; i < urlsToPin.length; i++) {
      const url = urlsToPin[i];
      const currentTabID = await findPinnedTab(
        windowID,
        currentlyManagedTabs[url],
        url
      );
      if (currentTabID) {
        console.debug(`Moving tab ${currentTabID} for ${url}`);
        /**await browser.tabs.move(currentTabID, {
          // Position in a specific order
          index: i,
        });*/
        currentlyManagedTabs[url].latestTabID = currentTabID;
      } else {
        missingTabs.push(url);
      }
    }

    const promises: Promise<void>[] = [];
    for (const u of missingTabs) {
      console.debug(`Creating tab for ${u}`);
      const p = createNewTab(u).then((newInfo) => {
        currentlyManagedTabs[u] = newInfo;
      });
      promises.push(p);
    }

    await Promise.all(promises);

    for (let i = 0; i < urlsToPin.length; i++) {
      const value = currentlyManagedTabs[urlsToPin[i]];
      await browser.tabs.move(value.latestTabID, {
        // Position in a specific order
        index: i,
      });
    }
  } catch (err) {
    logger.error(err);
  }

  // Delete any open tabs we are controlling.
  try {
    for (const tabUrl of Object.keys(currentlyManagedTabs)) {
      if (urlsToPin.indexOf(tabUrl) === -1) {
        logger.debug(`Removing old tab with URL ${tabUrl}`);
        await browser.tabs.remove(currentlyManagedTabs[tabUrl].latestTabID);
      }
    }
  } catch (err) {
    logger.error(err);
  }
  pinnedTabs[windowID] = currentlyManagedTabs;
  logger.log(
    `Configuring tabs in window ${windowID}, new config: `,
    pinnedTabs[windowID]
  );
  await setPinnedTabsInfo(pinnedTabs);
}

async function findPinnedTab(
  windowID: number,
  tabInfo: PinnedTabInfo | undefined,
  url: string
): Promise<null | number> {
  if (!tabInfo) {
    return null;
  }

  // First, try and find the tab based on it's last known ID
  try {
    const existingTab = await browser.tabs.get(tabInfo.latestTabID);
    if (existingTab && existingTab.id) {
      return existingTab.id;
    }
  } catch (err) {
    // NOOP
  }

  // If the ID fails, try and find it by it's final URL.
  // (this occurs when Chrome restarts).
  const tabs = await browser.tabs.query({
    windowId: windowID,
    pinned: true,
  });
  console.log(`Looking for ${tabInfo.finalURL}.`);
  for (const t of tabs) {
    if (t.url.indexOf(tabInfo.finalURL) === 0) {
      console.log(`     Using Tab: ${t.id} ${t.url}`);
      return t.id;
    }
  }
  console.log(`Unable to find tab: `, tabs);
  return null;
}

async function createNewTab(url: string): Promise<PinnedTabInfo> {
  const newTab = await browser.tabs.create({
    // Don't force focus on it.
    active: false,
    // Position in a specific order
    // index: position,
    // Ensure it's pinned
    pinned: true,
    // Provide URL of the tab
    url,
  });
  const tabInfo = {
    latestTabID: newTab.id,
    finalURL: newTab.url,
  };
  await new Promise((resolve) => {
    let lastUpdate = null;
    let timeoutID: NodeJS.Timeout | null = null;
    const QUIET_PERIOD_SECS = 1;
    const listener = (tabId: number, info: any) => {
      lastUpdate = Date.now();
      if (info.status === "complete") {
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
          browser.tabs.onUpdated.removeListener(listener);
          resolve();
        }, QUIET_PERIOD_SECS * 1000);
      }
    };
    browser.tabs.onUpdated.addListener(listener);
  });
  const updatedTab = await browser.tabs.get(tabInfo.latestTabID);
  tabInfo.finalURL = updatedTab.url;
  return tabInfo;
}
