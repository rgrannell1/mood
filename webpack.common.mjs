
import * as path from 'path'
import clean from 'clean-webpack-plugin'

export default {
  entry: {
    index: './client/js/pages/index.js',
    privacy: './client/js/pages/privacy.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('../public/js/pages')
  },
  plugins: [
    new clean.CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve('public/**/*')
      ]
    })
  ]
}
