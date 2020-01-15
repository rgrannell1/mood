
import * as fs from 'fs'

import fse from 'fs-extra'
import webpack from 'webpack'
import execa from 'execa'

const command = {
  name: 'build',
  dependencies: ['clean']
}

command.cli = `
Usage:
  script build
Description:
  Build
`

const build = {}

build.webpack = async ({ production }) => {
  const nodeEnv = process.env.NODE_ENV

  const source = await (nodeEnv === 'production'
    ? import('../../webpack.prod.mjs')
    : import('../../webpack.dev.mjs'))

  const webpackConfig = source.default

  await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (stats) {
        console.log(stats.toString({ colors: true }))
      }

      if (err) {
        reject(err)
      } else if (stats.hasErrors()) {
        reject(new Error('failed due to compiliation errors'))
      }

      resolve()
    })
  })
}

build.server = async () => {
  const { stdout, stderr } = await execa('./node_modules/.bin/tsc')
  console.log(stdout)
  console.error(stderr)
}

command.task = async (args = {}) => {
  try {
    await new Promise((resolve, reject) => {
      fs.mkdir('public', err => {
        err ? reject(err) : resolve()
      })
    })
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
  await build.server()
  await build.webpack({
    production: args['--production']
  })
  await Promise.all([
    fse.copy('client/css', 'public/css'),
    fse.copy('client/fonts', 'public/fonts'),
    fse.copy('client/icons', 'public/icons'),
    fse.copy('client/svg', 'public/svg'),
    fse.copy('client/favicon.ico', 'public/favicon.ico'),
    fse.copy('client/index.html', 'public/index.html'),
    fse.copy('client/manifest.webmanifest', 'public/manifest.webmanifest'),
    fse.copy('client/service-worker.js', 'public/service-worker.js')
  ])
}

export default command
