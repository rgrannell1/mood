
const admin = require('firebase-admin')

const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const signale = require('signale')
const config = require('./shared/config')()
const dotenv = require('dotenv').config()

const apiTests = require('./api-tests')
const browserTests = require('./browser-tests')

process.on('unhandledRejection', err => {
  signale.error(`${err.message}\n\n${err.stack}`)
  process.exit(1)
})

const key = JSON.parse(Buffer.from(dotenv.parsed.GOOGLE_PRIVATE_KEY, 'base64'))

admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: config.dbHost
})

const db = admin.firestore()

/**
 * Run synthetic monitoring
 */
async function syntheticMonitoring () {
  const browser = await puppeteer.launch({
    headless: true
  })

  // run e2e api-tests
  await apiTests(browser, config, db)
  await browserTests(browser, config, db)

  await browser.close()

  const result = await fetch(`${config.staticHost}/api/metadata`)
  const { version } = await result.json()

  signale.success(`all tests for deployment ${version} passed.`)
}

syntheticMonitoring()
