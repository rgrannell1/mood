
import merge from 'webpack-merge'
import common from './webpack.common.mjs'
import webpack from 'webpack'

export default merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __STATIC_HOST__: '"http://mood.rgrannell2.now.sh"',
      __API_HOST__: '"http://mood.rgrannell2.now.sh"'
    })
  ]
})
