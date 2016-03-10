
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: { path: __dirname, filename: './static/js/bundle.js' },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
