'use strict';

require('babel/register');

var gulp = require('gulp');
var babel = require('gulp-babel');
var combine = require('stream-combiner2');
var webpack = require('gulp-webpack');

var processJs = function() {
  return combine(
    babel()
  );
};

gulp.task('compile-js', function() {
  return gulp.src('lib/**/*.js')
    .pipe(processJs());
});

gulp.task('copy', function() {
  return gulp.src([
      'app/*.html',
      'app/*.mp3',
      'vendor/*.js'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack', function() {
  return gulp.src('app/index.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  gulp.watch('app/index.html', ['copy']);
  gulp.watch('lib/**/*.js', ['webpack']);
  // gulp.watch('app/**/*', ['build']);
});

gulp.task('default', ['webpack', 'copy']);
