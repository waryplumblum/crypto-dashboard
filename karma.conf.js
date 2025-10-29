process.env.CHROME_BIN = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe";

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
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Brave'],
    customLaunchers: {
      Brave: {
        base: 'Chrome',
        executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};