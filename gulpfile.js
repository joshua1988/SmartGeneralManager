/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    order = require("gulp-order"),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('source/*.html').pipe(gulp.dest('public/assets'));
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/js/controllers/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// gulp.task('build-css', function() {
//   return gulp.src('source/css/**/*.scss')
//     .pipe(sourcemaps.init())  // Process the original sources
//       .pipe(sass())
//     .pipe(sourcemaps.write()) // Add the map to modified source.
//     .pipe(gulp.dest('public/assets/stylesheets'));
// });

gulp.task('build-css', function() {
  gulp.src('source/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('uglify-vendor-css', function() {
  return gulp.src('source/css/vendor/**/*.css')
    .pipe(sourcemaps.init())  // Process the original sources
      .pipe(concat('vendor.css'))
      .pipe(uglifycss())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function() {
  return gulp.src('source/js/controllers/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});

gulp.task('build-vendor-js', function() {
  return gulp.src([
      'source/js/vendor/jquery/jquery-1.12.0.min.js',
      'source/js/vendor/jquery/jquery-ui.min.js',
      'source/js/vendor/select2/select2.min.js',
      'source/js/vendor/datatable/jquery.dataTables.min.js',
      'source/js/vendor/datatable/dataTables.bootstrap.min.js',
      'source/js/vendor/datatable/dataTables.buttons.min.js',
      'source/js/vendor/datatable/buttons.bootstrap.min.js',
      'source/js/vendor/datatable/jszip.min.js',
      'source/js/vendor/datatable/vfs_fonts.js',
      'source/js/vendor/datatable/buttons.html5.min.js',
      'source/js/vendor/datatable/buttons.print.min.js',
      'source/js/vendor/datatable/buttons.colVis.min.js',
      'source/js/vendor/bootstrap/bootstrap.min.js',
      'source/js/vendor/fusionchart/fusioncharts.js',
      'source/js/vendor/angular/angular.min.js',
      'source/js/vendor/**/*.js',
    ])
    .pipe(sourcemaps.init())
      // .pipe(order([
      //   "source/js/vendor/bootstrap/bootstrap.min.js",
      //   "source/js/vendor/fusionchart/fusioncharts.js",
      //   "source/js/vendor/angular/angular.min.js",
      //   "source/js/vendor/angular/angular-datepicker.js",
      //   "source/js/vendor/angular/angular-fusioncharts.min.js",
      //   "source/js/vendor/angular/angular-resource.min.js",
      //   "source/js/vendor/angular/angular-datatables.min.js",
      // ]))
      .pipe(concat('vendorBundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});

gulp.task('browser-sync', function() {

  var files = [
    'public/**/*.css',
    'public/**/*.js',
    'public/**/*.html',
    'public/**/*.png',
    'source/**/*.js',
    'source/**/*.html',
    'source/**/*.css',
    'source/**/*.scss',
    'source/**/*.png'
  ];

  browserSync.init(files,{
      proxy: "localhost:3000",
      browser: "google chrome",
      notify: false
  });

});

gulp.task('js-watch', ['build-js'], browserSync.reload);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('source/js/controllers/**/*.js', ['jshint', 'js-watch']);
  gulp.watch('source/css/**/*.scss', ['build-css']);
  gulp.watch('source/**/*.html', ['copyHtml'], browserSync.reload);
});
