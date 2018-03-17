require('babel-register')({
  plugins: [
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.scss', '.css'],
      },
    ],
  ],
});
require('babel-polyfill');
require('./server');
