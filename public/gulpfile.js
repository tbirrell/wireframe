var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');


//Compile SASS
gulp.task('sass', function(){
  return gulp.src('assets/scss/export.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()) // Using gulp-sass
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('assets/css/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Minify JS
gulp.task('minify-js', function() {
  return gulp.src('assets/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Minify Bower JS
gulp.task('minify-bower', function() {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(concat('bower.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

//Watch files
gulp.task('watch', ['clean', 'build', 'browserSync'], function(){
  gulp.watch('assets/scss/**/*.scss', ['sass', 'minify-css']);
  gulp.watch('../templates/**/*.php', browserSync.reload);
  gulp.watch('assets/js/**/*.js', ['minify-js']);
})

//Start Browser Sync
gulp.task('browserSync', function() {
  browserSync.init({
    proxy: "http://wireframe.127.0.0.1.nip.io/"
  })
})

//Clean
gulp.task('clean', function() {
  return del.sync('dist');
})

//Build
gulp.task('build', function(callback) {
  runSequence('sass', 'minify-css', 'minify-js', 'minify-bower', callback);
});

//Default
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});