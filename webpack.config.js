var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './app/index.js'],
    // vendor: ['processing-js', 'toxiclibsjs', 'underscore']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // plugins: [
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  // ],
  // plugins: [new webpack.optimize.UglifyJsPlugin()],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      // { test: require.resolve('toxiclibsjs'), loader: 'expose?toxi' },
      // { test: require.resolve('jquery'), loader: 'expose?jQuery' },
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
      path.join(__dirname, 'vendor', 'processing.min.js'),
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  noParse: /\.min\.js/
};
