const themename = "robertgoodman.us";

// Gulp package dependencies
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browser_sync = require('browser-sync').create();
const changed = require('gulp-changed');
const clean_css = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const imagemin = require('gulp-imagemin');
const line_ending_corrector = require('gulp-line-ending-corrector');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const root = "../";
const dst = root + 'dist/';
const dst_css = dst + 'css/';
const dst_html = dst + 'public/';
const dst_img = dst + 'img/';
const dst_js = dst + 'js/';
const src = root + 'src/';
const src_css = src + 'css/';
const src_img = src + 'img/';
const src_js = src + 'js/';
const src_scss = src + 'scss/';
const src_html = root;

const order_dependent_js = [];

const src_css_files = src_css + "/**/*.css";
const src_html_files = src_html + "**/*.html";
const src_img_files = src_img + "/**/*";
const src_js_files = src_js + "/**/*.js";
const src_scss_files = src_scss + "/**/*.scss";


function browser_reload(done) {
    browser_sync.reload();
    done();
}

function browser_resync(done) {
    browser_sync.init({
        server: {
            baseDir: './public'
        },
        //port: 3000
    });
    done();
}

function clean() {
    return del([dst_css, dst_img, dst_js]);
}

function process_css() {
    return gulp
        .src(src_css_files)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(line_ending_corrector())
        .pipe(clean_css())
        .pipe(rename({suffix: '.min'}))
        .pipe(changed(dst_css))
        .pipe(gulp.dest(dst_css))
        .pipe(browser_sync.stream());
}

function process_html() {
    return gulp
        .src(src_html_files)
        .pipe(plumber())
        .pipe(changed(dst_html))
        .pipe(browser_sync.stream());
}

function process_img() {
    return gulp
        .src(src_img_files)
        .pipe(plumber())
        .pipe(changed(dst_img))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(dst_img))
        .pipe(browser_sync.stream());
}

function process_js() {
    return gulp
        .src(src_js_files)
        .pipe(plumber())
        .pipe(changed(dst_js))
        .pipe(gulp.dest(dst_js))
        .pipe(browser_sync.stream());
}

function process_scss() {
    return gulp
        .src(src_scss_files)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(line_ending_corrector())
        .pipe(clean_css())
        .pipe(rename({suffix: '.min'}))
        .pipe(changed(dst_css))
        .pipe(gulp.dest(dst_css))
        .pipe(browser_sync.stream());
}

function watch_files() {
    gulp.watch(src_css_files, process_css);
    gulp.watch('*.html').on('change', browser_reload);
    gulp.watch(src_img_files, process_img);
    gulp.watch(src_js_files, process_js);
    gulp.watch(src_scss_files, process_scss);
}

const build = gulp.series(clean, gulp.parallel(process_css, process_img, process_js, process_scss));
const watch = gulp.parallel(watch_files, browser_resync);

exports.process_css = process_css;
exports.process_img = process_img;
exports.process_js = process_js;
exports.process_scss = process_scss;
exports.build = build;
exports.watch = watch;
exports.default = watch;
//exports.default = build;
