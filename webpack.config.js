const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './dist/jses.bundle.js',
    libraryTarget: 'commonjs',
    library: 'jses'
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
  devtool: 'source-map'
};
