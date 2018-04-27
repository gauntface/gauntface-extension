import { browser } from 'webextension-polyfill-ts';
import {onInstalled} from './lifecycle-controller';
import {onWindowCreated} from './window-controller';

// This class represents the "Application". It essentially
// acts as a single place to store shared information.
export class Application {

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    browser.runtime.onInstalled.addListener(onInstalled);
    browser.windows.onCreated.addListener(onWindowCreated);
  }
}

export const application = new Application();
