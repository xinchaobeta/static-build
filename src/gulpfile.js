import rev from 'gulp-rev'
import revReplace from 'gulp-rev-replace'
import uglify from 'gulp-uglify'
import csso from 'gulp-csso'
import filter from 'gulp-filter'
import path from 'path'
import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import htmlmin from 'gulp-htmlmin'
import autoprefixer from 'autoprefixer'
import size from 'gulp-size'
import babel from 'gulp-babel'
import pxtorem from 'postcss-pxtorem'
import postcss from 'gulp-postcss'
import beforeHtmlProcessing from './before-html-processing'
import browserSync from 'browser-sync'
import plumer from 'gulp-plumber'
import jade from 'gulp-jade'
import less from 'gulp-less'
import sass from 'gulp-sass'
import stylus from 'gulp-stylus'
import newer from 'gulp-newer'


const src = process.env.STATIC_BUILD_SRC
console.log('src = ', src)
const tmp = path.resolve(src, '../.tmp')
const dist = process.env.STATIC_BUILD_DIST

console.log('src = ', src, 'dist = ', dist)

const AUTOPREFIXER_BROWSERS = [
  'ios >= 7',
  'android >= 4.0',
]

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
  minifyCSS: true,
}

const filters = () => ({
  jsFilter: filter("**/*.js", {restore: true}),
  cssFilter: filter("**/*.css", {restore: true}),
  htmlFilter: filter("**/*.html", {restore: true}),
  jadeFilter: filter("**/*.jade", {restore: true}),
  sassFilter: filter("**/*.scss", {restore: true}),
  lessFilter: filter("**/*.less", {restore: true}),
  stylusFilter: filter("**/*.styl", {restore: true}),
  imgFilter: filter("**/*.{jpg,png,jpeg,gif,svg,webp}", {restore: true}),
  assetsFilter: filter("**/*.{js,css,jpg,png,jpeg,gif,svg,webp}", {restore: true}),
  publishFilter: filter("**/*.{html,js,css,jpg,png,jpeg,gif,svg,webp}", {restore: true}),
})

const processors = [
  pxtorem({rootValue: 100, propWhiteList: []}),
  autoprefixer({browsers: AUTOPREFIXER_BROWSERS}),
]

gulp.task('default', () => {
  const {jsFilter, cssFilter, imgFilter, assetsFilter, htmlFilter, publishFilter} = filters()
  return gulp.src(path.resolve(src, '**/*'), {base: src})
    .pipe(jsFilter)
    .pipe(babel())
    .pipe(uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(postcss(processors))
    .pipe(csso())
    .pipe(cssFilter.restore)
    .pipe(imgFilter)
    .pipe(imagemin({progressive: true, interlaced: true}))
    .pipe(imgFilter.restore)
    .pipe(assetsFilter)
    .pipe(rev())
    .pipe(assetsFilter.restore)
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(beforeHtmlProcessing())
    .pipe(htmlmin(htmlminOption))
    .pipe(htmlFilter.restore)
    .pipe(publishFilter)
    .pipe(size({title: 'assets', showFiles: true}))
    .pipe(gulp.dest(dist))
})


gulp.task('compile', () => {
  const {jadeFilter, sassFilter, lessFilter, stylusFilter} = filters()
  return gulp.src(path.resolve(src, '**/*.{jade,scss,less,stylus}'), {base: src})
    .pipe(newer(tmp))
    .pipe(plumer())
    .pipe(jadeFilter)
    .pipe(jade())
    .pipe(jadeFilter.restore)
    .pipe(sassFilter)
    .pipe(sass())
    .pipe(sassFilter.restore)
    .pipe(lessFilter)
    .pipe(less())
    .pipe(lessFilter.restore)
    .pipe(stylusFilter)
    .pipe(stylus())
    .pipe(stylusFilter.restore)
    .pipe(gulp.dest(src))
})


gulp.task('dev', ['compile'], () => {
  browserSync({
    server: [src],
    port:9000,
    open: false,
  })
  gulp.watch(path.resolve(src, '**/*'), ['compile', browserSync.reload])
  return console.log("server start at 9000 port")
})
