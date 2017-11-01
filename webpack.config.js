const path = require('path');


module.exports = {
  entry: './client/App.js',
  output: {
    path: path.resolve('build'),
    filename: 'index_bundle.js'
  },
  watch: true,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
