import { browser } from 'webextension-polyfill-ts';
import {onInstalled} from './controllers/onInstalled';
import {onWindowCreated, onWindowRemoved} from './controllers/windowController';
import {logger} from './utils/logger';

async function start() {
  browser.windows.onCreated.addListener(onWindowCreated);
  browser.windows.onRemoved.addListener(onWindowRemoved);
  browser.runtime.onInstalled.addListener(onInstalled);
}

start();
