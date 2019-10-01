
const fetch = require('node-fetch')
const signale = require('signale')
const dotenv = require('dotenv').config()

const tests = {
  metadata: {},
  moods: {}
}

/**
 * convert an object to a string.
 *
 * @param {Object} value
 */
const asBody = value => {
  return JSON.stringify(value, null, 2)
}

tests.metadata.get = async host => {
  const result = await fetch(`${host}/api/metadata`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${dotenv.parsed.TEST_ACCOUNT_CREDENTIAL}`
    }
  })

  if (result.status !== 200) {
    signale.error(`GET api/metadata returned ${result.status}`)
  } else {
    const content = await result.json()

    const hasDescription = Object.prototype.hasOwnProperty.call(content, 'description')
    const hasVersion = Object.prototype.hasOwnProperty.call(content, 'version')

    if (!hasDescription || !hasVersion) {
      signale.error('GET api/metadata failed tests')
    } else {
      signale.success('GET api/metadata worked as expected')
    }
  }
}

tests.moods.get = async host => {
  const result = await fetch(`${host}/api/moods`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${dotenv.parsed.TEST_ACCOUNT_CREDENTIAL}`
    }
  })

  if (result.status !== 200) {
    signale.error(`GET api/moods returned ${result.status}`)
  } else {
    signale.success('GET api/moods worked as expected')
  }
}

tests.moods.patch = async host => {
  const events = [
    {
      type: 'send-mood',
      mood: 'Ennui',
      timestamp: new Date(1000000000000)
    },
    {
      type: 'send-mood',
      mood: 'Stellar',
      timestamp: new Date(2000000000000)
    }
  ]

  const result = await fetch(`${host}/api/moods`, {
    method: 'PATCH',
    headers: {
      Authorization: `Basic ${dotenv.parsed.TEST_ACCOUNT_CREDENTIAL}`
    },
    body: asBody({
      events
    })
  })

  if (result.status !== 200) {
    signale.error(`PATCH api/moods returned ${result.status}`)
  } else {
    signale.success('PATCH api/moods worked as expected')
    // -- check firebase manually for the result
  }
}

const apiTests = async config => {
  await Promise.all([
    tests.metadata.get(config.apiHost),
    tests.moods.patch(config.apiHost),
    tests.moods.get(config.apiHost)
  ])
}

module.exports = apiTests
