var gulp = require('gulp'),
 	fileinclude = require('gulp-file-include'),
 	sass = require('gulp-sass'),
 	htmlhint  = require('gulp-htmlhint'),
 	csslint = require('gulp-csslint'),
	browserSync = require('browser-sync');

gulp.task('sass', function () {
  return gulp.src('src/module/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'));
});

gulp.task('watch', function () {
	gulp.watch('src/module/**/*.scss', ['sass']);
	gulp.watch('src/markup/**/*.scss', ['fileinclude']);
});

gulp.task('fileinclude', function() {
  gulp.src(['src/markup/**/.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/result'));
});

gulp.src("src/result/**/*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())

gulp.task('css', function() {
  gulp.src('src/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter());
});

gulp.task('browser-sync', () => {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["dist/**/*.*"],
        port: 7000
    })
});

gulp.task('default', ['watch','fileinclude','browser-sync','css']);
