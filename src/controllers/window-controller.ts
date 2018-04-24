import { Windows, browser } from "webextension-polyfill-ts";
import {logger} from '../utils/logger';
import { configurePinnedTabs } from "./pinned-tabs";

export async function initWindowController() {
  logger.debug('Initialising window controller');
  const allWindows = await browser.windows.getAll();
  for (const window of allWindows) {
    await configurePinnedTabs(window.id);
  }
}

export async function onWindowCreated(window: Windows.Window) {
  logger.debug('New window created');
  if (window.type === 'normal') {
    await configurePinnedTabs(window.id);
  }
}
