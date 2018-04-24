import { browser, Runtime } from 'webextension-polyfill-ts';
import {initWindowController} from './window-controller';
import {logger} from '../utils/logger';

export async function onInstalled(details: Runtime.OnInstalledDetailsType) {
  await browser.runtime.openOptionsPage();
  await initWindowController();
}
