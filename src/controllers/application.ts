import { Tabs, browser } from 'webextension-polyfill-ts';
import {onInstalled, onExtensionStartup, onStorageChange} from './_lifecycle-controller';
import {onWindowCreated} from './_window-controller';
import { configurePinnedTabs } from './_pinned-tabs';
import {logger} from '../utils/_logger';

// This class represents the "Application". It essentially
// acts as a single place to store shared information.
export class Application {
  constructor() {
    this.setupEventListeners();

    // This is an async operation, but can't be blocked in
    // the constructor
    onExtensionStartup();
  }

  private setupEventListeners() {
    browser.runtime.onInstalled.addListener(onInstalled);
    browser.storage.onChanged.addListener(onStorageChange);
    browser.windows.onCreated.addListener(onWindowCreated);
    browser.runtime.onMessage.addListener((message) => this.onMessage(message));
  }

  private async onMessage(message: any) {
    switch (message.type) {
      case 'update-pinned-tabs':
        if (message.data && message.data.windowID) {
          await configurePinnedTabs(message.data.windowID);
        } else {
          logger.warn(`Received 'update-pinned-tabs' message with no windowID format:`, message)
        }
        break;
      default:
        logger.warn(`Unknown message type: ${message.type}`, message);
        
    }
  }
}

export const application = new Application();
