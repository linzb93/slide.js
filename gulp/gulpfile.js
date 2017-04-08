var gulp = require('gulp');
var fs = require('fs');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');

gulp.task('do', function() {
    var cr = fs.readFileSync('src/copyright', 'utf-8');
    return gulp.src('src/*.js').
    //添加copyright
    pipe(header(cr)).
    pipe(gulp.dest('dist/')).
    //压缩
    pipe(uglify()).
    //添加copyright
    pipe(header(cr)).
    pipe(rename({
        extname: '.min.js'
    })).
    pipe(gulp.dest('dist/'));
});

gulp.task('default', ['do']);