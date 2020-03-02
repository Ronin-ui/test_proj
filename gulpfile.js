'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');

const connect = require('gulp-connect');			  // virtual server
const livereload = require('gulp-livereload');	      // reload page
const notify = require('gulp-notify');                // show notify

const paths = {
  src: {
    html: 'app/*.html',
    sass: 'sass/**',
    css: 'css/css',
    js: 'js/*',
    img: 'images/**',
    fonts: 'font/**',
    spritesImages: 'app/assets/sprites/*',
    spritesSass: 'app/assets/sass/',
    spritesImg: 'app/assets/img/',
    sprites: 'app/assets/sprites/*'
  },
  dist: {
    html: 'build/',
    css: '../static/css/',
    js: 'build/assets/js/',
    img: 'build/assets/img/',
    fonts: 'build/assets/font/',
    libs: 'build/assets/libs/'
  }
};

gulp.task('html', function () {
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dist.html))
    .pipe(connect.reload())
  .pipe(notify('HTML DONE!'));

});

gulp.task('sass', function () {
  return gulp.src(paths.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(paths.src.css))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(livereload())
    .pipe(connect.reload())
    .pipe(notify('SASS DONE!'));
});

gulp.task('js', function () {
  return gulp.src(paths.src.js)
    .pipe(concat('temp.js'))
    .pipe(uglify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(notify('JS DONE!'));
});

gulp.task('img', function () {
  return gulp.src(paths.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.img))
    .pipe(notify('Images DONE!'))
});

gulp.task('font', function () {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dist.fonts))
    .pipe(notify('FONTS DONE!'));
});

gulp.task('lib', function () {
  return gulp.src(paths.src.libs)
    .pipe(gulp.dest(paths.dist.libs))
    .pipe(notify('LIBS DONE!'))
});

gulp.task('server', function () {
  connect.server({
    root: 'app/',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/assets/sass/**', ['sass']);
  gulp.watch('app/assets/js/**', ['js']);
  gulp.watch('app/assets/img/**', ['img']);
  gulp.watch('app/assets/font/**', ['font']);
});

gulp.task('default',['html','sass','js','lib','font','img','server','watch']);



gulp.task('pack-js', function () {
    return gulp.src(['js/*.js', '!js/bundle.js'])
        .pipe(concat('bundle.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('js'));
});

gulp.task('pack-css', function () {
    return gulp.src(['css/custom/*.css', 'css/main.css'])
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCss())
    .pipe(gulp.dest('css/'));
});

gulp.task('build', ['pack-css', 'pack-js']);
