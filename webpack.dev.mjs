
import merge from 'webpack-merge'
import common from './webpack.common.mjs'
import webpack from 'webpack'
import nanoid from 'nanoid'

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      __DEPLOYMENT_VERSION__: `"${nanoid(32)}"`,
      __STATIC_HOST__: '"http://localhost:4000"',
      __API_HOST__: '"http://localhost:4010"'
    })
  ]
})
