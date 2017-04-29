var gulp = require('gulp'),
    clean = require('gulp-clean'),
 	fileinclude = require('gulp-file-include'),
 	sass = require('gulp-sass'),
 	htmlhint  = require('gulp-htmlhint'),
    sassLint = require('gulp-sass-lint'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    clone = require('gulp-clone'),
    uglify = require('gulp-uglifyjs');

const autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', function () {
  return gulp.src('src/result/**/', {read: false})
        .pipe(clean());
});

gulp.task('uglify', ['clean'], function() {
  gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('src/result/js'))
});

gulp.task('htmlHint', function() {
  return gulp.src('src/html/**/')
  .on('error', function(err) {})
    .pipe(htmlhint.reporter());
});

gulp.task('jslint', function() {
  return gulp.src('src/js/**/*.js')
  .on('error', function(err) {})
    .pipe(jslint())
    .pipe(jslint.reporter('default'));
});

gulp.task('clone', ['clean'], function (cb) {
 return gulp.src('src/asset/**/')
   .pipe(clone())
 .pipe(gulp.dest('src/result'));
});

//변경 scss
gulp.task('sassLint', function() {
  return gulp.src('src/scss/**/')
  .on('error', function(err) {})
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('sass', ['clean'], function () {
  return gulp.src('src/scss/**/')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('src/scss/maps'))
    .pipe(gulp.dest('src/result/css'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/html/**/*.html', ['htmlHint']);
    gulp.watch('src/js/**/*.js', ['jslint']);
    gulp.watch('src/scss/**/*.scss', ['sassLint']);
    gulp.watch('src/scss/**/', ['sass']);
	gulp.watch(['src/html/**/*.html','!src/html/include/**'] , ['fileinclude']);
    gulp.watch('src/js/**/*.js' , ['uglify']);
    gulp.watch('src/asset/**/' , ['clone']);
});

gulp.task('fileinclude', ['clean'], function() {
  gulp.src(['src/html/**/*.html','!src/html/include/**'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/result/html'));
});

gulp.task('build', ['sass', 'htmlHint', 'jslint', 'sassLint', 'fileinclude', 'uglify', 'clone']);

gulp.task('default', function() {
    gulp.start('build');
});
