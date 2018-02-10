var gulp = require('gulp');
var ts = require('gulp-typescript');
var path = require('path');
let tsConfigFileName = 'tsconfig.json';

gulp.task('default', ['copy', 'compile', 'typings']);

gulp.task('compile', function () {
    var tsProject = ts.createProject(tsConfigFileName);
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('typings', function () {
    var tsProject = ts.createProject(tsConfigFileName);
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.dts.pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src('./tests/testpage.html')
        .pipe(gulp.dest('./dist/tests'));
});