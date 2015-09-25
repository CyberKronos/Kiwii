var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglifyjs');
var wrap = require('gulp-wrap');
var karma = require('karma').server;
var angularTemplateCache = require('gulp-angular-templatecache');
// var addStream = require('add-stream');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/app/**/*.js'],
  html: ['./www/app/**/*.html'],
  vendor: ['./www/lib/**/*']
};

var __testDir = process.cwd() + '/www/test';

gulp.task('default', ['sass', 'js', 'templates']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'iOS > 6']
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('vendor', function(done) {
  var paths = [
    './www/lib/underscore/underscore.js',
    './www/lib/ionic/js/ionic.bundle.js',
    './www/lib/ionic-service-core/ionic-core.js',
    "./www/lib/collide/collide.js",
    "./www/lib/ngstorage/ngStorage.min.js",
    "./www/lib/angular-jwt/dist/angular-jwt.js",
    './www/lib/ngCordova/dist/ng-cordova.js'
  ];

  return gulp.src(paths)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./www/dist'))
});

gulp.task('js', function(done) {
  var paths = [
    './www/lib/ionic-contrib-tinder-cards/ionic.tdcards.js',
    "./www/lib/angular-flux-helpers/angular-flux.js",
    './www/app/app.js',
    './www/app/**/*.js'
  ];

  return gulp.src(paths)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./www/dist'))
});

gulp.task('watch', function() {
  gulp.watch([paths.sass, paths.js, paths.vendor, paths.html], function() {
    gulp.start('default');
  });
  gulp.start('default');
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __testDir + '/karma.conf.js'
  }, done);
});

gulp.task('test-once', function(done) {
  karma.start({
    configFile: __testDir + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('templates', function() {
  return gulp.src('./www/**/*.html')
            .pipe(angularTemplateCache('templates.js', { standalone: true }))
            .pipe(concat('templates.js'))
            .pipe(gulp.dest('./www/cache/'));
});

// function prepareTemplates() {
//   return gulp.src('./www/templates/*.html')
//     //.pipe(minify and preprocess the template html here)
//     .pipe(angularTemplateCache('templates.js', { standalone: true }));
// }