const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));

const {npmRun} = require('./utils/npm-run');
const {moduleToBundle} = require('./utils/module-to-bundle');

async function bundleBrowserModules() {
  const modulesDir = path.join(global.__buildConfig.dest);
  const browserDir = path.join(global.__buildConfig.dest);

  await moduleToBundle(path.join(modulesDir, 'background.js'), browserDir);
}

async function build() {
  await npmRun('typescript:modules');
  await bundleBrowserModules();
}

build.displayName = `typescript-modules-and-browser`;

module.exports = {
  build,
};
