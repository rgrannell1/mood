
const fs = require('fs').promises
const fse = require('fs-extra')
const path = require('path')
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch')
const puppeteer = require('puppeteer')

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

  await page.goto('https://mood.rgrannell2.now.sh')

  page.setViewport({
    width: viewport.width,
    height: viewport.height
  })

  return { page }
}

const captureViewportScreenshots = async (browser, viewports) => {
  const dir = path.join(__dirname, '../../data/')

  for (const viewport of viewports) {
    const { page } = await createPage(browser, viewport)
    const filenames = {
      full: `${viewport.device}-${(new Date()).toISOString()}.png`,
      latest: `${viewport.device}-latest.png`,
      previous: `${viewport.device}-previous.png`,
      diff: `${viewport.device}-diff.png`,
    }
    const paths = {
      full: path.resolve(dir, filenames.full),
      latest: path.resolve(dir, filenames.latest),
      previous: path.resolve(dir, filenames.previous),
      diff: path.resolve(dir, filenames.diff)
    }

    await page.screenshot({
      path: paths.full
    })

    try {
      await fse.copy(paths.latest, paths.previous)
    } catch (err) {
      console.log(err)
      continue
    }

    await fse.copy(paths.full, paths.latest)

    const images = {
      old: PNG.sync.read(await fs.readFile(paths.previous)),
      new: PNG.sync.read(await fs.readFile(paths.latest))
    }

    const diff = new PNG({ width: viewport.width, height: viewport.height })

    pixelmatch(images.old.data, images.new.data, diff.data, viewport.width, viewport.height)

    await fs.writeFile(paths.diff, PNG.sync.write(diff))
  }
}

async function main () {
  const browser = await puppeteer.launch()

  await captureViewportScreenshots(browser, viewports)

  await browser.close()
}

main()
