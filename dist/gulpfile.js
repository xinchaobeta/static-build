'use strict';

var _gulpRev = require('gulp-rev');

var _gulpRev2 = _interopRequireDefault(_gulpRev);

var _gulpRevReplace = require('gulp-rev-replace');

var _gulpRevReplace2 = _interopRequireDefault(_gulpRevReplace);

var _gulpUglify = require('gulp-uglify');

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpCsso = require('gulp-csso');

var _gulpCsso2 = _interopRequireDefault(_gulpCsso);

var _gulpFilter = require('gulp-filter');

var _gulpFilter2 = _interopRequireDefault(_gulpFilter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpImagemin = require('gulp-imagemin');

var _gulpImagemin2 = _interopRequireDefault(_gulpImagemin);

var _gulpHtmlmin = require('gulp-htmlmin');

var _gulpHtmlmin2 = _interopRequireDefault(_gulpHtmlmin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _gulpSize = require('gulp-size');

var _gulpSize2 = _interopRequireDefault(_gulpSize);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _postcssPxtorem = require('postcss-pxtorem');

var _postcssPxtorem2 = _interopRequireDefault(_postcssPxtorem);

var _gulpPostcss = require('gulp-postcss');

var _gulpPostcss2 = _interopRequireDefault(_gulpPostcss);

var _beforeHtmlProcessing = require('./before-html-processing');

var _beforeHtmlProcessing2 = _interopRequireDefault(_beforeHtmlProcessing);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _gulpPlumber = require('gulp-plumber');

var _gulpPlumber2 = _interopRequireDefault(_gulpPlumber);

var _gulpJade = require('gulp-jade');

var _gulpJade2 = _interopRequireDefault(_gulpJade);

var _gulpLess = require('gulp-less');

var _gulpLess2 = _interopRequireDefault(_gulpLess);

var _gulpSass = require('gulp-sass');

var _gulpSass2 = _interopRequireDefault(_gulpSass);

var _gulpStylus = require('gulp-stylus');

var _gulpStylus2 = _interopRequireDefault(_gulpStylus);

var _gulpNewer = require('gulp-newer');

var _gulpNewer2 = _interopRequireDefault(_gulpNewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const src = process.env.STATIC_BUILD_SRC;
console.log('src = ', src);
const tmp = _path2.default.resolve(src, '../.tmp');
const dist = process.env.STATIC_BUILD_DIST;

console.log('src = ', src, 'dist = ', dist);

const AUTOPREFIXER_BROWSERS = ['ios >= 7', 'android >= 4.0'];

const htmlminOption = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeOptionalTags: true,
  minifyJS: true,
  minifyCSS: true
};

const filters = () => ({
  jsFilter: (0, _gulpFilter2.default)("**/*.js", { restore: true }),
  cssFilter: (0, _gulpFilter2.default)("**/*.css", { restore: true }),
  htmlFilter: (0, _gulpFilter2.default)("**/*.html", { restore: true }),
  jadeFilter: (0, _gulpFilter2.default)("**/*.jade", { restore: true }),
  sassFilter: (0, _gulpFilter2.default)("**/*.scss", { restore: true }),
  lessFilter: (0, _gulpFilter2.default)("**/*.less", { restore: true }),
  stylusFilter: (0, _gulpFilter2.default)("**/*.styl", { restore: true }),
  imgFilter: (0, _gulpFilter2.default)("**/*.{jpg,png,jpeg,gif,svg,webp}", { restore: true }),
  assetsFilter: (0, _gulpFilter2.default)("**/*.{js,css,jpg,png,jpeg,gif,svg,webp}", { restore: true }),
  publishFilter: (0, _gulpFilter2.default)("**/*.{html,js,css,jpg,png,jpeg,gif,svg,webp}", { restore: true })
});

const processors = [(0, _postcssPxtorem2.default)({ rootValue: 100, propWhiteList: [] }), (0, _autoprefixer2.default)({ browsers: AUTOPREFIXER_BROWSERS })];

_gulp2.default.task('default', () => {
  var _filters = filters();

  const jsFilter = _filters.jsFilter;
  const cssFilter = _filters.cssFilter;
  const imgFilter = _filters.imgFilter;
  const assetsFilter = _filters.assetsFilter;
  const htmlFilter = _filters.htmlFilter;
  const publishFilter = _filters.publishFilter;

  return _gulp2.default.src(_path2.default.resolve(src, '**/*'), { base: src }).pipe(jsFilter).pipe((0, _gulpBabel2.default)()).pipe((0, _gulpUglify2.default)()).pipe(jsFilter.restore).pipe(cssFilter).pipe((0, _gulpPostcss2.default)(processors)).pipe((0, _gulpCsso2.default)()).pipe(cssFilter.restore).pipe(imgFilter).pipe((0, _gulpImagemin2.default)({ progressive: true, interlaced: true })).pipe(imgFilter.restore).pipe(assetsFilter).pipe((0, _gulpRev2.default)()).pipe(assetsFilter.restore).pipe((0, _gulpRevReplace2.default)()).pipe(htmlFilter).pipe((0, _beforeHtmlProcessing2.default)()).pipe((0, _gulpHtmlmin2.default)(htmlminOption)).pipe(htmlFilter.restore).pipe(publishFilter).pipe((0, _gulpSize2.default)({ title: 'assets', showFiles: true })).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('compile', () => {
  var _filters2 = filters();

  const jadeFilter = _filters2.jadeFilter;
  const sassFilter = _filters2.sassFilter;
  const lessFilter = _filters2.lessFilter;
  const stylusFilter = _filters2.stylusFilter;

  return _gulp2.default.src(_path2.default.resolve(src, '**/*.{jade,scss,less,stylus}'), { base: src }).pipe((0, _gulpNewer2.default)(tmp)).pipe((0, _gulpPlumber2.default)()).pipe(jadeFilter).pipe((0, _gulpJade2.default)()).pipe(jadeFilter.restore).pipe(sassFilter).pipe((0, _gulpSass2.default)()).pipe(sassFilter.restore).pipe(lessFilter).pipe((0, _gulpLess2.default)()).pipe(lessFilter.restore).pipe(stylusFilter).pipe((0, _gulpStylus2.default)()).pipe(stylusFilter.restore).pipe(_gulp2.default.dest(src));
});

_gulp2.default.task('dev', ['compile'], () => {
  (0, _browserSync2.default)({
    server: [src],
    port: 9000,
    open: false
  });
  _gulp2.default.watch(_path2.default.resolve(src, '**/*'), ['compile', _browserSync2.default.reload]);
  return console.log("server start at 9000 port");
});