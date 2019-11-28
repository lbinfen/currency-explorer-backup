const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    entry: __dirname + '/src/bcoinsdk.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bcoinsdk.node.min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          keep_fnames: true
        }
      })
    ]
  },
  devtool: "source-map"
}