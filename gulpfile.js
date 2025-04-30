const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const fs = require('fs');
const path = require('path');
const rename = require('gulp-rename');
const through = require('through2');
const { deleteAsync } = require('del');

// Paths
const paths = {
  src: 'src',
  dist: 'dist',
  scss: 'src/scss/**/*.scss',
  html: '*.html',
  js: 'src/js/*.js',
  assets: 'src/assets/**/*',
};

function convertDateFormat(dateStr) {
  // Use regex to match day, month, and year
  const regex = /(\d{2})\/(\d{2})\/(\d{4})/;
  // Replace with year-month-day format
  return dateStr.replace(regex, '$3-$2-$1');
}

// Process HTML files
gulp.task('html', function () {
  return gulp
    .src(paths.html)
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(gulp.dest(paths.dist));
});

// Process SCSS files
gulp.task('scss-build', function () {
  return gulp
    .src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename('maverick-wave.min.css'))
    .pipe(gulp.dest(path.join(paths.dist)));
});
gulp.task('scss-release', function () {
  return gulp
    .src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('maverick-wave.css'))
    .pipe(gulp.dest(path.join('.')));
});

// Copy JavaScript files
gulp.task('js-build', function () {
  return gulp
    .src(paths.js)
    .pipe(terser())
    .pipe(rename('maverick-wave.min.js'))
    .pipe(gulp.dest(path.join(paths.dist)));
});
gulp.task('js-release', function () {
  return gulp
    .src(paths.js)
    .pipe(rename('maverick-wave.js'))
    .pipe(gulp.dest(path.join('.')));
});

// Copy assets
gulp.task('assets', function () {
  return gulp
    .src(paths.assets, { encoding: false })
    .pipe(gulp.dest(path.join(paths.dist)));
});

// Inject build info into HTML
gulp.task('inject-build-info', function () {
  // Get package.json data
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  // Create build info object
  const buildInfo = {
    name: packageJson.name,
    version: packageJson.version,
    buildDate: convertDateFormat(new Date().toLocaleDateString('en-DE')),
  };

  // Create a custom transform stream to inject build info
  const injectBuildInfo = through.obj(function (file, enc, cb) {
    if (file.isBuffer()) {
      let contents = file.contents.toString();

      // Replace placeholders with actual values
      contents = contents.replace(/\{\{VERSION\}\}/g, buildInfo.version);
      contents = contents.replace(
        /\{\{LAST_BUILD_DATE\}\}/g,
        buildInfo.buildDate
      );
      contents = contents.replace(
        /\{\{LAST_BUILD_YEAR\}\}/g,
        buildInfo.buildDate.slice(0, 4)
      );

      file.contents = Buffer.from(contents);
    }

    this.push(file);
    cb();
  });

  return gulp
    .src(path.join(paths.dist, '*.html'))
    .pipe(injectBuildInfo)
    .pipe(gulp.dest(paths.dist));
});

// clean - remove dist and maverick-wave.css & maverick-wave.js
gulp.task('clean', async function () {
  await deleteAsync(['dist', 'maverick-wave.css', 'maverick-wave.js'], {
    force: true,
  });
});

// Watch for changes
gulp.task('watch', function () {
  gulp.watch(paths.scss, gulp.series('scss-build'));
  gulp.watch('*.html', gulp.series('html', 'inject-build-info'));
  gulp.watch('src/partials/*.html', gulp.series('html', 'inject-build-info'));
  gulp.watch(paths.js, gulp.series('js-build'));
  gulp.watch(paths.assets, gulp.series('assets'));
});

// Build task
gulp.task(
  'build',
  gulp.series(
    gulp.parallel('scss-build', 'js-build', 'assets', 'html'),
    'inject-build-info'
  )
);

// Release task
gulp.task('release', gulp.series(gulp.parallel('scss-release', 'js-release')));

// Default task
gulp.task('default', gulp.series('build', 'watch'));
