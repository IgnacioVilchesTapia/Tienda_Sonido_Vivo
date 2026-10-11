module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-html-reporter',
    ],
    files: [{ pattern: 'src/test-entry.js', watched: false }],
    preprocessors: { 'src/test-entry.js': ['webpack'] },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx', '.json'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: [['istanbul', { exclude: ['**/*.spec.js', '**/*.spec.jsx', 'src/test-entry.js'] }]],
              },
            },
          },
          {
            test: /\.m?js$/,
            include: /node_modules/,
            resolve: { fullySpecified: false },
          },
          { test: /\.css$/, type: 'asset/source' },
          { test: /\.(svg|png|jpe?g)$/, type: 'asset/inline' },
        ],
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcovonly' }],
    },
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    client: { jasmine: { random: true } },
    singleRun: false,
    restartOnFileChange: true,
  });
};

