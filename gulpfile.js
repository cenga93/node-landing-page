const { src, dest, series, watch } = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify');

const paths = {
  style: {
    src: 'src/assets/scss/**/*.scss',
    dest: `public/css/`,
    watchFiles: 'src/assets/scss/**/*.scss',
  },
};

// style
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

// js compress
const scripts = () => {
  return src(['src/assets/js/main.js'])
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(uglify())
    .pipe(dest('public/js'));
};

// WATCHING
const Watching = () => {
  const root = './';
  browserSync.init({ server: root });

  watch(paths.style.watchFiles, Style);
  watch('src/assets/js/main.js', scripts);
};

const build = series(Style, Watching);

exports.default = build;
