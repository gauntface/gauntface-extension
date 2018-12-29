/* const gulp = require('gulp');
const path = require('path');

const bumpManifestVersion = require('./gulp-tasks/bump-manifest-version');
const zip = require('./gulp-tasks/zip');

gulp.task('publish', (done) => {
  process.env.NODE_ENV = 'production';

  return gulp.series([
    bumpManifestVersion,
    'build',
    zip,
  ])(done);
});
*/

const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const {setConfig} = require('@hopin/wbt-config');
const tsBrowser = require('@hopin/wbt-ts-browser'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', function() {
  return fs.remove(dst);
})

gulp.task('build',
  gulp.series(
    'clean',
    tsBrowser.gulpBuild('gauntface.extension')
  )
);
