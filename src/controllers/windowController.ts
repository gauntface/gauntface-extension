import { Windows, browser } from "webextension-polyfill-ts";
import {logger} from '../utils/logger';
import { configurePinnedTabs } from "./pinnedTabs";

let currentPinnedWindowId: number|null = null;

async function setupPinnedTabs() {
  if (currentPinnedWindowId !== null) {
    return;
  }

  const currentWindow = await attemptToFindAWindow();
  if (currentWindow) {
    currentPinnedWindowId = currentWindow.id;
    await configurePinnedTabs(currentPinnedWindowId);
  }
}

async function attemptToFindAWindow(): Promise<Windows.Window|null> {
  try {
    return await browser.windows.getCurrent();
  } catch (err) {
    // NOOP
  }
  return null;
}

export async function initWindowController() {
    await setupPinnedTabs();
}

export async function onWindowCreated(window: Windows.Window) {
  await setupPinnedTabs();
}

export async function onWindowRemoved(windowId: number) {
  if (currentPinnedWindowId === windowId) {
    currentPinnedWindowId = null;
  }
  await setupPinnedTabs();
}
