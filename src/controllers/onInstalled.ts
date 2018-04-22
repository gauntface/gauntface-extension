import { Runtime } from 'webextension-polyfill-ts';
import {initWindowController} from './windowController';
import {logger} from '../utils/logger';

// tslint:disable-next-line:no-any
export function onInstalled(details: Runtime.OnInstalledDetailsType) {
  logger.log('On Install: ', details);
  initWindowController();
}
