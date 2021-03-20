const { src, dest, series, watch } = require('gulp'),
  sourcemaps  = require('gulp-sourcemaps'),
  plumber     = require('gulp-plumber'),
  sass        = require('gulp-sass'),
  sassLint    = require('gulp-sass-lint'),
  rename      = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  babel       = require('gulp-babel'),
  uglify      = require('gulp-uglify'),
  nodemon     = require('gulp-nodemon'),
  del         = require('del');

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
  sassLint: '.sass-lint.yml',
};

const Style = () => {
  return src(paths.style.src)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sassLint({
        options: {
          configFile: paths.sassLint,
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

    .pipe(sourcemaps.write('./'))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
};

const Clean = () => {
  return del(['public/css', 'public/js'], { force: true });
};

const develop = () => {
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
