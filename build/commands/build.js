
const fs = require('fs').promises
const fse = require('fs-extra')
const webpack = require('webpack')

const command = {
  name: 'build',
  dependencies: ['build-typescript']
}

command.cli = `
Usage:
  script build [--production]
Description:
  Build
`

const build = {}

build.webpack = async ({ production }) => {
  const webpackConfig = production
    ? require('../../webpack.prod')
    : require('../../webpack.dev')

  await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      console.log(stats.toString({ colors: true }))

      if (err) {
        reject(err)
      } else if (stats.hasErrors()) {
        reject(new Error('failed due to compiliation errors'))
      }

      resolve()
    })
  })
}

command.task = async args => {
  try {
    await fs.mkdir('public')
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }

  await build.webpack({
    production: args['--production']
  })
  await Promise.all([
    fse.copy('client/css', 'public/css'),
    fse.copy('client/fonts', 'public/fonts'),
    fse.copy('client/icons', 'public/icons'),
    fse.copy('client/favicon.ico', 'public/favicon.ico'),
    fse.copy('client/index.html', 'public/index.html'),
    fse.copy('client/manifest.webmanifest', 'public/manifest.webmanifest'),
    fse.copy('client/privacy.html', 'public/privacy.html'),
    fse.copy('client/service-worker.js', 'public/service-worker.js')
  ])
}

module.exports = command
