// make sure NPM is installed ( check in cmd with 'npm -v')

// open cmd 
// run : cd <project location>

// install gulp 				: npm install gulp
// install gulp-sass 			: npm install gulp-sass
// install gulp-typescript 		: npm install gulp-typescript typescript
// install gulp-sourcemaps (?)	: npm install gulp-sourcemaps
// install gulp-jade            : npm install gulp-jade

// run : gulp build

//---------------------------------------------------------------------//

// Gulp
var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

// Sass module
var sass = require('gulp-sass');

// Typescript module
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

// Pug module
var pug = require('gulp-pug');

// Location variables
var locations = {
    src: "src",
    dest: "dest"
}

// BUILD
gulp.task('build', function(callback) {
    runSequence('clean', ['sass', 'pug', 'ts', 'dts', 'copy'], 'watch', callback);
});

// CLEAN
gulp.task('clean', function() {
    return del([locations.dest + '/**/*']);
});

// Style Task ( SASS )
gulp.task('sass', function() {
    return gulp.src(locations.src + '/css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest(locations.dest + '/static/style'))
});

// JS Task ( TYPESCRIPT )
gulp.task('ts', function() {
    return gulp.src(locations.src + '/js/**/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            removeComments: true,
            outFile: "clock.js"
        }))
        .pipe(gulp.dest(locations.dest + '/static/js'))
});

// TS Task ( TYPESCRIPT Definition files )
gulp.task('dts', function() {
    return gulp.src([locations.src + '/js/**/*.ts', '!' + locations.src + '/js/external/**/*.ts'])
        .pipe(ts({
            declaration: true
        }))
        .dts.pipe(gulp.dest(locations.dest + '/static/js/d.ts'));
});

// Copy Task ( Fonts etc. )
gulp.task('copy', function () {
    gulp.src(locations.src + '/img/**/*').pipe(gulp.dest(locations.dest + '/static/img'));
    gulp.src(locations.src + '/fonts/*').pipe(gulp.dest(locations.dest + '/static/fonts'));
    gulp.src(locations.src + '/uploads/**/*').pipe(gulp.dest(locations.dest + '/uploads'));
});

// HTML Task ( PUG )
gulp.task('pug', function() {
    var variables = {};
    return gulp.src(locations.src + '/html/*.pug')
        .pipe(pug({
            pretty: true
        })).pipe(gulp.dest(locations.dest)) // Move HTML files to the root folder
});

// Release
gulp.task('release', function() {
    gulp.src(locations.src + '/js/modules/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            removeComments: false,
            outFile: "clock.js"
        }))
        .pipe(gulp.dest('release'));

    gulp.src(locations.src + '/css/main.scss')
        .pipe(sass({
            outFile: "clock.css"
        }))
        .pipe(gulp.dest('release/style'));
    
    gulp.src(locations.src + '/img/**/*').pipe(gulp.dest('release/img'));
    gulp.src(locations.src + '/fonts/*').pipe(gulp.dest('release/fonts'));
});

// Watch task
gulp.task('watch', function() {
    gulp.watch(locations.src + '/css/**/*.scss', ['sass']);
    gulp.watch(locations.src + '/js/**/*.ts', ['ts', 'dts']);
    gulp.watch(locations.src + '/html/**/*.pug', ['pug']);
    gulp.watch(locations.src + '/img/**/*', ['copy']);
    gulp.watch(locations.src + '/fonts/*', ['copy']);
    gulp.watch(locations.src + '/uploads/**', ['copy']);
});