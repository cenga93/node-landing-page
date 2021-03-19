const { src, dest, series, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');
const del = require('del');

const paths = {
  style: {
    src: 'src/assets/scss/**/*.scss',
    dest: `public/css/`,
    watchFiles: 'src/assets/scss/**/*.scss',
  },
  js: {
    src: 'src/assets/js/main.js',
    dest: 'public/js',
    watchFiles: 'src/assets/js/**/*.js',
  },
};

const Style = () => {
  return src(paths.style.src)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sassLint({
        options: {
          configFile: '.sass-lint.yml',
        },
      })
    )
    .pipe(sassLint.format())
    .pipe(sass.sync({ outputStyle: 'compressed' }))
    .on('error', sass.logError)
    .pipe(
      rename({
        basename: 'app',
        suffix: '.min',
      })
    )
    .pipe(sourcemaps.write('./'))
    .pipe(dest(paths.style.dest))
    .pipe(browserSync.stream());
};

const Script = () => {
  return src(paths.js.src)
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(uglify())
    .pipe(dest(paths.js.dest, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

const Clean = () => {
  return del(['public/css', 'public/js'], { force: true });
};

const develop = (cb) => {
  return nodemon({
    script: 'app.js',
    watch: ['app.js', 'src/**/*'],
    ignore: ['gulpfile.js', 'node_modules/**', 'public/**', 'src/assets/js'],
  }).on('restart', () => {
    browserSync.reload();
  });
};

// WATCHING
const Watching = (cb) => {
  watch(paths.style.watchFiles, Style);
  watch(paths.js.watchFiles, Script);
  develop(cb);
};

const build = series(Clean, Style, Script, Watching);

exports.default = build;
