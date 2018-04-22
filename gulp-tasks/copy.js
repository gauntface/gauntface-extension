const gulp = require('gulp');
const path = require('path');

function copyTest() {
  return gulp.src(path.posix.join(__dirname, '..', 'test', 'static', '**', `*`))
  .pipe(gulp.dest(path.join(global.__buildConfig.temp, 'test', 'static')));
}

function copySrc() {
  return gulp.src(path.posix.join(__dirname, '..', 'src', '**', `*.json`))
  .pipe(gulp.dest(path.join(global.__buildConfig.dest)));
}

module.exports = {
  build: gulp.parallel([copyTest, copySrc]),
};
