var gulp = require('gulp');
var fs = require('fs');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

gulp.task('do', function() {
    var cr = fs.readFileSync('src/copyright', 'utf-8');
    return gulp.src('src/accordion.js').
    //移除测试内容
    pipe(replace(new RegExp('//测试开始[^//测试结束]*//测试结束', 'g'), '')).
    //压缩
    pipe(uglify()).
    //添加copyright
    pipe(header(cr)).
    pipe(rename({
        extname: '.min.js'
    })).
    pipe(gulp.dest('dist/'));
})

gulp.task('default', ['do']);