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
    ],
    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader: 'transform?brfs'
      }
    ]
  },
  devtool: 'inline-source-map'
};
