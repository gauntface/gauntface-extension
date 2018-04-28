const gulp = require('gulp');
const path = require('path');
const bumpManifestVersion = require('./gulp-tasks/bump-manifest-version');
const zip = require('./gulp-tasks/zip');

const getTaskFilepaths = require('./gulp-tasks/utils/get-task-filepaths');

global.__buildConfig = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist'),
  temp: path.join(__dirname, 'build'),
};

const loadTasks = () => {
  const taskFiles = getTaskFilepaths();
  for (const taskFilepath of taskFiles) {
    const {task} = require(taskFilepath);
    if (task) {
      gulp.task(task);
    }
  }
};

loadTasks();

gulp.task('publish', (done) => {
  process.env.NODE_ENV = 'production';

  return gulp.series([
    bumpManifestVersion,
    'build',
    zip,
  ])(done);
});
