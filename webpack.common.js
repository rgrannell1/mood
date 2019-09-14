
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './client/js/pages/index.js',
    privacy: './client/js/pages/privacy.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/public/js/pages')
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve('public/**/*')
      ]
    })
  ]
}
