import { Runtime } from 'webextension-polyfill-ts';
import {initWindowController} from './window-controller';
import {logger} from '../utils/logger';

// tslint:disable-next-line:no-any
export function onInstalled(details: Runtime.OnInstalledDetailsType) {
  logger.log('On Install: ', details);
  initWindowController();
}
