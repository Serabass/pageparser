var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['copy', 'compile']);

gulp.task('compile', function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('release'));
});

gulp.task('copy', function () {
    return gulp.src('./tests/testpage.html')
        .pipe(gulp.dest('./dist/tests'));
});