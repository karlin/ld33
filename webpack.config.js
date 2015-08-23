var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['webpack/hot/dev-server', './app/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // plugins: [new webpack.optimize.UglifyJsPlugin()],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: require.resolve('jquery'), loader: 'expose?$' },
      { test: require.resolve('jquery'), loader: 'expose?jQuery' },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'app')
        ],
        loader: 'babel-loader'
      },
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  noParse: /\.min\.js/
};
