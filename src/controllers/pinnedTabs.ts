import {logger} from '../utils/logger';
import { browser } from 'webextension-polyfill-ts';

export async function configurePinnedTabs(windowId: number) {
  const urlsToPin = [
    'https://inbox.google.com/',
    'https://tweetdeck.twitter.com/',
    'https://open.spotify.com/'
  ];

  for (let i = 0; i < urlsToPin.length; i++) {
    const url = urlsToPin[i];
    const matchingTabs = await browser.tabs.query({
      windowId,
      url: `${url}*`,
      pinned: true,
    });

    if (matchingTabs.length > 0) {
      const tabToRepurpose = matchingTabs[0];
      await browser.tabs.move(tabToRepurpose.id, {
        // Position in a specific order
        index: i,
      });
      for (let j = 1; j < matchingTabs.length; j++) {
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
}
