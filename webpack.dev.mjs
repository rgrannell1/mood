
import merge from 'webpack-merge'
import common from './webpack.common.mjs'
import webpack from 'webpack'

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      __STATIC_HOST__: '"http://localhost:3000"',
      __API_HOST__: '"http://localhost:3001"'
    })
  ]
})
