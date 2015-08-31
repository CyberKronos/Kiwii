// Karma configuration
// Generated on Wed Jun 03 2015 10:58:53 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'faker'],


    // list of files / patterns to load in the browser
    files: [
      'lib/angular/angular.js',
      'lib/angular-animate/angular-animate.js',
      'lib/angular-sanitize/angular-sanitize.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-ui-router/release/angular-ui-router.js',

      'lib/ionic/js/ionic.js',
      'lib/ionic/js/ionic-angular.js',

      'lib/parse-js-sdk/lib/parse.js',
      'lib/lodash/lodash.js',
      'lib/ionic-service-core/ionic-core.js',
      'lib/ionic-service-deploy/ionic-deploy.js',
      'lib/ionic-contrib-tinder-cards/ionic.tdcards.js',
      'lib/collide/collide.js',
      'lib/ngCordova/dist/ng-cordova.js',
      'lib/angular-jwt/dist/angular-jwt.js',
      'lib/ngstorage/ngStorage.js',
      'lib/angular-flux-helpers/angular-flux.js',
      'lib/ion-autocomplete/dist/ion-autocomplete.js',
      'lib/parse-angular-patch/src/parse-angular.js',
      'lib/ion-slide-box-tabs/src/js/slidingTabsDirective.js',
      'lib/cordova-exif/cordova-exif.js',
      'lib/exif-js/exif.js',
      'lib/ng-material-floating-button/src/mfb-directive.js',

      'js/app.js',
      'js/*.js',
      'js/**/*.js',
      'test/spec/**/*.js',
      'test/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'js/**/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
