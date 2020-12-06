    const gulp = require('gulp'),
        gutil = require('gulp-util'),
        scss = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        ftp = require('vinyl-ftp');

    var server = require('gulp-server-livereload');

    gulp.task('scss', function () {
        return gulp.src('./common/styles/pano.scss')
            .pipe(sourcemaps.init())
            .pipe(scss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('../dist/css/'));
    });

    gulp.task('css', function () {
        return gulp.src('./common/js/**/*.css')
            .pipe(gulp.dest('../dist/css/'));
    });

    gulp.task('html', function () {
        return gulp.src('./apps/dev/*.html')
            .pipe(gulp.dest('../dist/'))
    });

   /* gulp.task('php', function () {
        return gulp.src('./apps/lscn/*.php')
            .pipe(gulp.dest('../dist/'))
    }); */

    gulp.task('img', function () {
        return gulp.src('./apps/dev/assets/img/**/*.*')
            .pipe(gulp.dest('../dist/img'))
    });

    gulp.task('fonts', function () {
        return gulp.src('./common/fonts/**/*.*')
            .pipe(gulp.dest('../dist/fonts'))
    });

    gulp.task('js', function () {
        return gulp.src('./common/js/**/*.*')
            .pipe(gulp.dest('../dist/js'))
    });

    gulp.task('watch', function () {
        gulp.watch('src/**/*.*', gulp.parallel('scss', 'html', 'css', 'img', 'fonts', 'js')); /* 'php', */
    });

    gulp.task('webserver', function () {
        gulp.src('app')
            .pipe(server({
                livereload: true,
                directoryListing: true,
                open: true
            }));
    });

    gulp.task('deploy', function () {
        var conn = ftp.create({
            host: '91.236.136.137',
            user: 'avazmutall_all',
            password: 'clear000',
            parallel: 10,
            log: gutil.log
        });

        var globs = [
            './../dist/**',
            '.htaccess',
        ];

        return gulp.src(globs, {buffer: false})
            .pipe(conn.dest('/'));
    });

    gulp.task('serve', gulp.parallel('watch', () => gulp
            .src('./../dist/')
            .pipe(server({
                livereload: false,
                directoryListing: false,
                open: false,
                defaultFile: 'index.html'
            }))
        )
    );

    gulp.task('default', gulp.parallel('scss', 'html', 'css', 'img', 'fonts', 'js', 'serve')); /* 'php', */
