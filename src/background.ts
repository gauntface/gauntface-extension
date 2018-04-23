import { browser } from 'webextension-polyfill-ts';
import {onInstalled} from './controllers/lifecycle-controller';
import {onWindowCreated, onWindowRemoved} from './controllers/window-controller';
import './application';

async function start() {
  browser.windows.onCreated.addListener(onWindowCreated);
  browser.windows.onRemoved.addListener(onWindowRemoved);
  browser.runtime.onInstalled.addListener(onInstalled);
}

start();
