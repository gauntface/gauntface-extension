import { browser } from 'webextension-polyfill-ts';
import {onInstalled, onExtensionStartup, onStorageChange} from './lifecycle-controller';
import {onWindowCreated} from './window-controller';

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
  }
}

export const application = new Application();
