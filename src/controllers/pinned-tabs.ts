import { browser } from 'webextension-polyfill-ts';
import {logger} from '../utils/logger';
import {getUrlsToPin} from '../models/pinned-tabs';

export async function configurePinnedTabs(windowId: number) {
  try {
  const urlsToPin = await getUrlsToPin();

  for (let i = 0; i < urlsToPin.length; i++) {
    const url = urlsToPin[i];
    const matchingTabs = await browser.tabs.query({
      windowId,
      url: `${url}*`,
      pinned: true,
    });

    logger.log(`For URL: ${url}, got matches: `, matchingTabs);

    if (matchingTabs.length > 0) {
      const tabToRepurpose = matchingTabs[0];
      await browser.tabs.move(tabToRepurpose.id, {
        // Position in a specific order
        index: i,
      });
      for (let j = 1; j < matchingTabs.length; j++) {
        // If the tab we arre about to remove is currently opened,
        // re-focus the tab to the pinned one.
        if (matchingTabs[j].active) {
          await browser.tabs.update(tabToRepurpose.id, {
            active: true,
          });
        }

        await browser.tabs.remove(matchingTabs[j].id);
      }
    } else {
      await browser.tabs.create({
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
  }
} catch (err) {
  logger.error(err);
}
}
