module.exports = function (config) {
  config.set({
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
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reporters: [
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
        { type: 'text-summary' },
      ],
    },
  });
};
