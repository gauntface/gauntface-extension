import {getPopupURLs} from '../models/_popup-urls';
import { browser } from "webextension-polyfill-ts";

export async function configurePanels() {
  const popupUrls = await getPopupURLs();
  for (let i = 0; i < popupUrls.length; i++) {
    const url = popupUrls[i];

    const tabs = await browser.tabs.query({
      url: `${url}/*`,
    });

    const panelWindows = [];
    for (const tab of tabs) {
      const w = await browser.windows.get(tab.windowId);
      if (w.type === 'popup') {
        panelWindows.push(w);
      }
    }

    if (panelWindows.length > 1) {
      for (let j = 1; j < panelWindows.length; j++) {
        browser.windows.remove(panelWindows[j].id);
      }
    } else if(panelWindows.length === 0) {
      const window = await browser.windows.create({
        width: 600,
        height: 340,
        left: 100 * i,
        top: 100 * i,
        type: 'popup',
        focused: true,
        // tslint:disable-next-line:no-any
      } as any);

      browser.tabs.create({
        url,
        windowId: window.id,
      });
    }
  }
}
