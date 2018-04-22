import {factory, Logger} from '@hopin/logger/dist/modules/browser/index';

export const logger = factory.getLogger('gauntface-extension', {
  prefix: 'gauntface-extension',
});
