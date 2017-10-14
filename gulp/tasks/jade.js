'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var options = require('../config');

gulp.task('jade', function (callback) {
    gulp.src(options.jade.src)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(options.jade.dest))
    callback();
});
