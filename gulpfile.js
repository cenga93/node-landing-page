const { src, dest, series, watch } = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  nodemon = require('gulp-nodemon'),
  del = require('del'),
  iconfont = require('gulp-iconfont'),
  iconfontCss = require('gulp-iconfont-css');

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
  icons: {
    src: 'public/img/svg/*.svg',
    dest: 'public/www/svg',
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

// ICON FONT -> CONVERT SVG ICONS TO FONT SVG ICONS
const SvgFont = () => {
  return src(paths.icons.src)
    .pipe(
      iconfontCss({
        fontName: 'svgicons',
        cssClass: 'icon',
        path: 'src/assets/config/icon-font.scss',
        targetPath: '../../../src/assets/scss/fonts/_icon-font.scss',
        fontPath: 'svg/',
      })
    )
    .pipe(
      iconfont({
        fontName: 'svgicons',
        prependUnicode: false,
        formats: ['ttf', 'woff'],
        normalize: true,
        centerHorizontally: true,
      })
    )
    .pipe(dest(paths.icons.dest));
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

const build = series(Clean, SvgFont, Style, Script, Watching);

exports.default = build;
