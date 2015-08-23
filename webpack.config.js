var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './app/index.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'app')
        ],
        loader: 'babel-loader'
      },
    ],
    noParse: [
      path.join(__dirname, 'vendor', 'toxiclibs.min.js'),
      path.join(__dirname, 'vendor', 'processing.min.js')
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  noParse: /\.min\.js/
};
