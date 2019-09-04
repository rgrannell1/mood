
const signale = require('signale')
const api = require('jsonbin-io-api')
const fetch = require('node-fetch')
const config = require('./config')

const asBody = data => {
  return JSON.stringify(data, null, 2)
}

const userData = {}

/**
 * create a collection for a user if it does not exist
 *
 * @param {string} userId the user id
 * @param {string} data the event-content to save
 *
 * @returns {Promise<*>}
 */
userData.create = async (userId, data = { }) => {
  // -- check if it already exists

  const res = await fetch('https://api.jsonbin.io/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'secret-key': config.jsonbin.key,
      'private': true,
      'name': `userdata-${userId}`
    },
    body: asBody({
      userId,
      creationDate: new Date(),
      ...data
    })
  })

  if (res.status !== 200) {
    signale.error(`failed to create entry in JSONBin; response had status ${res.status} and message ${res.body.message}`)
  }

  if (res.success === false) {
    throw new Error(res.message)
  }
}

module.exports = {
  userData
}
