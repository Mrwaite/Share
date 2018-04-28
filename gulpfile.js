var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles' , function () {
   return sass('src/styles/main.scss', { style : 'expanded' })
       .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'andriod 4'))
       .pipe(gulp.dest('dist/assets/css'))
       .pipe(rename({suffix : '.min'}))
       .pipe(minifycss())
       .pipe(gulp.dest('dist/assets/css'))
       .pipe(notify({ message : 'Style Task Complete'}));
});

gulp.task('scripts', function () {
   return gulp.src('src/scripts/**/*.js')
       .pipe(jshint('.jshintrc'))
       .pipe(jshint.reporter('default'))
       .pipe(concat('main.js'))
       .pipe(gulp.dest('dist/assets/js'))
       .pipe(rename({ suffix : '.min' }))
       .pipe(uglify())
       .pipe(gulp.dest('dist/assets/js'))
       .pipe(notify({ message : 'scripts task complete' }));
});
gulp.task('images', function () {
   return gulp.src('src/images/**/*')
       .pipe(cache(imagemin({ optimizationLevel : 5, progressive : true, interlaced : true})))
       .pipe(gulp.dest('dist/assets/img'))
       .pipe(notify({ message : 'Image task complete' }));
});

gulp.task('clean', function (cb) {
   del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb);
});

gulp.task('default', ['clean','styles', 'scripts', 'images']);

gulp.task('watch', function () {
   //watch scss files
   //gulp.watch('src/styles/**/*.scss', ['styles']);

   //watch .js files
   //gulp.watch('src/scripts/**/*.js', ['scripts']);

   //watch image files
   //gulp.watch('src/image/**/*', ['images']);

   //create livereload server
   livereload.listen();

   //watch any files in dist/, reload on change
   gulp.watch(['dist/**']).on('change', livereload.changed());
});





