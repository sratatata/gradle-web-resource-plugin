(function() {
    var fs = require('fs-extra');
    var uglify = require('gulp-uglify');
    var mainBowerFiles = require('main-bower-files');
    var coffee = require('gulp-coffee');
    var less = require('gulp-less');
    var cssmin = require('gulp-minify-css');
    var gulpFilter = require('gulp-filter');
    var gulp = require('gulp');
    var include = require("gulp-include");

    gulp.task('less', function() {
        if (fs.existsSync('${srcLess}')) {
            if (!fs.existsSync('${destLess}')) {
                fs.mkdirsSync('${destLess}');
            }
            return gulp.src('${srcLess}/**/*.less')
                .pipe(gulpFilter(${filterLess}))
                .pipe(less())
                .pipe(cssmin({root: '${srcLess}'}))
                .pipe(gulp.dest('${destLess}'));
        }
    });

    gulp.task('coffee', function() {
        if (fs.existsSync('${srcCoffee}')) {
            if (!fs.existsSync('${destCoffee}')) {
                fs.mkdirsSync('${destCoffee}');
            }
            return gulp.src('${srcCoffee}/**/*.coffee')
                .pipe(include())
                .pipe(gulpFilter(${filterCoffee}))
                .pipe(coffee())
                .pipe(uglify())
                .pipe(gulp.dest('${destCoffee}'));
        }
    });

    gulp.task('bower-files', function() {
        if (fs.existsSync('bower.json')) {
            gulp.src(mainBowerFiles(), { base: '${workDir}/bower_components' })
                .pipe(gulp.dest('${destLib}'));
        }
    });

    gulp.task('watch', function() {
        if (fs.existsSync('${srcLess}')) {
            gulp.watch('${srcLess}/**/*.less', ['less']);
        }
        if (fs.existsSync('${srcCoffee}')) {
            gulp.watch('${srcCoffee}/**/*.coffee', ['coffee']);
        }
    });

    gulp.task('default', ['less', 'coffee', 'bower-files'], function() {
    });
})();
