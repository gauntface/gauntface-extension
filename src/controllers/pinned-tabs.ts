import { browser } from 'webextension-polyfill-ts';
import {logger} from '../utils/logger';
import {getUrlsToPin} from '../models/pinned-tabs';

let promiseChain = Promise.resolve();

export function configurePinnedTabs(windowId: number): Promise<void> {
  // Forrce a promise chain so steps don't interfere with multiple events
  // and calls causing updates.
  promiseChain = promiseChain.then(async () => {
    try {
      const urlsToPin = await getUrlsToPin();
    
      for (let i = 0; i < urlsToPin.length; i++) {
        const url = urlsToPin[i];
        const matchingTabs = await browser.tabs.query({
          windowId,
          url: `${url}*`,
          pinned: true,
        });
    
        if (matchingTabs.length > 0) {
          logger.log(`For URL: ${url}, got matches: `, matchingTabs);
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
          logger.log(`Creating new tab for URL: ${url}`);
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
  });
  return promiseChain;
}
