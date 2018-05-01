const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

async function bumpManifestVersion() {
  const manifestPath = path.join(global.__buildConfig.src, 'manifest.json');
  const manifestContents = await fs.readJSON(manifestPath);
  const newVersion = semver.inc(manifestContents.version, 'patch');
  if (!newVersion) {
    throw new Error(`Version could not be bumped by semver: ${manifestContents.version}`);
  }
  manifestContents.version = newVersion;
  await fs.writeFile(manifestPath, JSON.stringify(manifestContents, null, 2));
}

module.exports = bumpManifestVersion;