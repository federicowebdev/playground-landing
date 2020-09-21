//gulpfile.js
var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass');

//new plugs
var plumber = require('gulp-plumber');
var path = require('path');
var autoprefixer = require('autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var notifier = require('node-notifier');
var postcss = require('gulp-postcss');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

function showError(arg) {
  notifier.notify({
    title: 'Error',
    message: arg,
    sound: 'Basso',
  });
  console.log(arg);
  this.emit('end');
}

gulp.task('build', () => {
  gulp.start('styles', 'scripts');
});

gulp.task('styles', () => {
  return gulp
    .src('public/src/scss/app.scss')
    .pipe(
      plumber(function (error) {
        console.log('Error happend!', error.message);
        this.emit('end');
      })
    )
    .pipe(
      sass({
        precision: 10,
        onError: showError,
        outputStyle: 'compressed',
      })
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(
      postcss([
        autoprefixer({
          browsers: [
            'last 3 versions',
            'Firefox ESR',
            'Explorer >= 9',
            'Android >= 4.0',
            '> 2%',
          ],
        }),
      ])
    )
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('scripts', () => {
  return (
    browserify({
      entries: ['public/src/script/app.js'],
      debug: false,
      standalone: 'App',
    })
      .transform('babelify', { presets: ['es2015'] })
      .bundle()
      .on('error', showError)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest('public/dist/js'))
      .pipe(rename('app.min.js'))
      //.pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', showError)
      //.pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('public/dist/js'))
  );
});

gulp.task('watch', ['build'], () => {
  var watcher_scss = gulp.watch('public/src/scss/**/*.scss', ['styles']);
  watcher_scss.on('change', function (path, stats) {
    console.log('File ' + path + ' was changed');
  });

  var watcher_js = gulp.watch(['public/src/script/**/*.js'], ['scripts']);
  watcher_js.on('change', function (path, stats) {
    console.log('File ' + path + ' was changed');
  });
});

gulp.task('default', ['watch']);
