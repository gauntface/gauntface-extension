const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));

const {npmRun} = require('./utils/npm-run');
const {moduleToBundle} = require('./utils/module-to-bundle');

async function bundleBrowserModules() {
  const modulesDir = path.join(global.__buildConfig.dest);
  const browserDir = path.join(global.__buildConfig.dest);

  const entryPoints = [
    'application.js',
    'options-page.js',
    'new-tab-page.js',
    'popup-page.js',
  ];
  await Promise.all(entryPoints.map((filename) => {
    return moduleToBundle(path.join(modulesDir, 'controllers', filename), path.join(browserDir, 'controllers'));
  }));
}

async function build() {
  await npmRun('typescript:modules');
  await bundleBrowserModules();
}

build.displayName = `typescript-modules-and-browser`;

module.exports = {
  build,
};
