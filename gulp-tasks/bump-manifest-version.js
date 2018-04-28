const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

async function bumpManifestVersion() {
  const manifestPath = path.join(global.__buildConfig.src, 'mainfest.json');
  const manifestContents = await fs.readJSON(manifestPath);
  manifestContents.version = semver.inc(manifestContents.version, 'minor');
  await fs.writeJSON(manifestContents);
}

module.exports = bumpManifestVersion;