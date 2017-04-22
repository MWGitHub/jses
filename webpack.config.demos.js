const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './main.js'],
  output: {
    path: __dirname,
    filename: './assets/js/bundle.js',
    libraryTarget: 'var',
    library: 'Game'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /.js$/,
        loader: 'babel',
        exclude: /(node_modules)/
      }
    ]
  },
  devtool: 'inline-eval-source-map'
};
