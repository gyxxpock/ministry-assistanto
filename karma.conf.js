module.exports = function (config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
        { type: 'text-summary' },
      ],
    },
  });
};
