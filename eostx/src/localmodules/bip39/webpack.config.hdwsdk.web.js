const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  target: "web",
  mode: "production",
  entry: {
    entry: __dirname + '/src/hdwsdk.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'hdwsdk.web.min.js',
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