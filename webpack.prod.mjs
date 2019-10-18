
import merge from 'webpack-merge'
import common from './webpack.common.mjs'
import webpack from 'webpack'
import nanoid from 'nanoid'

export default merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __DEPLOYMENT_VERSION__: `"${nanoid(32)}"`,
      __STATIC_HOST__: '"http://mood.rgrannell2.now.sh"',
      __API_HOST__: '"http://mood.rgrannell2.now.sh"'
    })
  ]
})
