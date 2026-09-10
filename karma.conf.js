// Karma configuration for @angular/build:karma.
// NOTE: This file is only loaded because angular.json's test target sets
// "karmaConfig": "karma.conf.js". Without that, the builder falls back to an
// internal config (html + text-summary only) and this file is ignored — which
// is why coverage/coverage-summary.json used to go stale. Keep the config
// complete (frameworks/plugins/browsers) since the builder starts from {} when
// a karmaConfig path is provided.
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      reporters: [
        // HTML report per file — kept under the project subdir (unchanged location).
        { type: 'html', subdir: 'ministry-assistanto' },
        // Machine-readable totals consumed by .claude/scripts/check-coverage.sh.
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
        // Console summary printed after each run.
        { type: 'text-summary' },
      ],
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-sandbox',
          '--js-flags=--max-old-space-size=4096',
        ],
      },
    },
    restartOnFileChange: true,
    singleRun: false,
  });
};
