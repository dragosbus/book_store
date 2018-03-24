'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rollup = require('gulp-rollup');

gulp.task('serve',['scripts'], () => {
    gulp.watch('*.html').on('change', browserSync.reload);
    
    browserSync.init({
        server: './'
    });
});

gulp.task('scripts', () => {
    gulp.src('./js/**/*.js')    
        .pipe(rollup({
            input: ['./js/app.js'],
            format:'cjs'
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});