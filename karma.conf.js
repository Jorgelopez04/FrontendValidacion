module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // config de jasmine si se necesita
      },
      clearContext: false 
    },
    jasmineHtmlReporter: {
      suppressAll: true 
    },
    coverageReporter: {
      dir: 'coverage/frontend-tailorflow',
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly', file: 'lcov.info' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    
    // 🔧 MODIFICACIÓN CLAVE: Configuramos ChromeHeadless para que sea liviano
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--remote-debugging-port=9222'
        ]
      }
    },

    singleRun: true,
    restartOnFileChange: false,
    failOnEmptyTestSuite: false,

    // 🚀 TIEMPOS DE ESPERA AUMENTADOS (MODO SUPERVIVENCIA):
    browserNoActivityTimeout: 300000, // 5 minutos (evita el disconnect por lag)
    browserDisconnectTimeout: 60000,  // 1 minuto para reconectar
    browserDisconnectTolerance: 3,    // 3 intentos de reconexión
    captureTimeout: 240000            // 4 minutos para capturar el browser
  });
};