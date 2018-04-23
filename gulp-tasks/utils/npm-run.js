const path = require('path');
const spawn = require('./spawn-promise');

function npmRun(scriptName) {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return spawn(npmCmd, ['run', scriptName], {
    cwd: path.join(__dirname, '..', '..'),
    stdio: 'inherit',
  });
};

module.exports = {
  npmRun,
};
