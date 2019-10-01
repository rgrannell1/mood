
const fs = require('fs').promises
const fse = require('fs-extra')
const path = require('path')
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch')
const signale = require('signale')

const viewports = [
  {
    width: 1080,
    height: 1920,
    device: 'iPhone-7-Plus'
  },
  {
    width: 2960,
    height: 1440,
    device: 'Samsung-Galaxy-S8+'
  },
  {
    width: 1920,
    height: 1080,
    device: 'Dell XPS'
  },
  {
    width: 1280,
    height: 720,
    device: 'Oppo-F1'
  },
  {
    width: 2048,
    height: 1536,
    device: 'Apple-iPad-Mini-2'
  }
]

const createPage = async (browser, viewport) => {
  const page = await browser.newPage()

  await page.goto(url)

  page.setViewport({
    width: viewport.width,
    height: viewport.height
  })

  return { page }
}

const captureViewportScreenshots = async (config, browser, viewports) => {
  const dir = path.join(__dirname, '../../data/')

  for (const viewport of viewports) {
    signale.debug(`capturing ${viewport.device} screenshots`)

    const { page } = await createPage(config.staticHost, browser, viewport)
    const filenames = {
      full: `${viewport.device}-${(new Date()).toISOString()}.png`,
      latest: `${viewport.device}-latest.png`,
      previous: `${viewport.device}-previous.png`,
      diff: `${viewport.device}-diff.png`
    }
    const paths = {
      full: path.resolve(dir, filenames.full),
      latest: path.resolve(dir, filenames.latest),
      previous: path.resolve(dir, filenames.previous),
      diff: path.resolve(dir, filenames.diff)
    }

    await page.screenshot({ path: paths.full })
    signale.success(`saved screen shot for ${viewport.device}`)

    try {
      await fse.copy(paths.latest, paths.previous)
      signale.success('wrote existing \'latest\' screenshot to \'previous\'')
    } catch (err) {
      signale.error('\'latest\' screenshot did not exist')
    }

    await fse.copy(paths.full, paths.latest)

    try {
      const images = {
        old: PNG.sync.read(await fs.readFile(paths.previous)),
        new: PNG.sync.read(await fs.readFile(paths.latest))
      }

      const diff = new PNG({ width: viewport.width, height: viewport.height })
      const diffPixels = pixelmatch(images.old.data, images.new.data, diff.data, viewport.width, viewport.height)

      if (diffPixels) {
        signale.warn(`pixels differed between accepted previous and latest for ${viewport.device}`)
      }

      await fs.writeFile(paths.diff, PNG.sync.write(diff))

      signale.success(`saved diffs for ${viewport.device}`)
    } catch (err) {
      signale.error(`failed to diff screenshots: ${err.message}`)
    }

    // -- todo warn on diff
  }
}

module.exports = {
  captureViewportScreenshots,
  viewports
}
