var gulp = require('gulp'),
 	fileinclude = require('gulp-file-include'),
 	sass = require('gulp-sass'),
 	htmlhint  = require('gulp-htmlhint'),
    csslint = require('gulp-csslint'),
    webreporter = require('gulp-hint-web-reporter'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync');

const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp.src('src/module/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function () {
	gulp.watch('src/module/**/*.scss', ['sass']);
	gulp.watch('src/markup/*.html', 'src/module/**/*.html', ['fileinclude']);
});

gulp.task('fileinclude', function() {
  gulp.src(['src/markup/*.html','src/module/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/result'));
});

gulp.task('browser-sync', function() {
    browserSync({
        files: ["src/module/**/*.*","src/markup/*.*"],
        proxy: "http://localhost:80/dev/wordpress_project",
        open: 'external',
        logprefix: "bs"
    });
});

gulp.task('default', ['watch','fileinclude','browser-sync']);
