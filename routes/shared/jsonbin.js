
const signale = require('signale')
const api = require('jsonbin-io-api')
const config = require('./config')

const jsonbin = new api(config.jsonbin.key)

const moodStore = {}

/**
 * create a collection for a user if it does not exist
 *
 * @param {string} userId the user ID
 *
 * @returns {Promise<*>}
 */
moodStore.create = userId => {
  const collectionId = `moods-${userId}`

  const res = await jsonbin.createCollection({
    data: {
      name: collectionId
    }
  })

  if (res.success === false) {
    throw new Error(res.message)
  }
}

const userStore = {}

/**
 * create a collection for a user if it does not exist
 *
 * @param {string} userId the user id
 * @param {string} data the event-content to save
 *
 * @returns {Promise<*>}
 */
userStore.create = (userId, data) => {
  const collectionId = `moods-${userId}`

  const res = await jsonbin.createBin({
    collectionId,
    data: {

    },
    isPrivate: true
  })

  if (res.success === false) {
    throw new Error(res.message)
  }
}

const storage = {}

/**
 * @param {string} userId
 */
storage.createUser = async userId => {
  await Promise.all([
    userStore.create(userId),
    moodStore.create(userId)
  ])

  signale.success(`created storage for user ${userId}`)
}

module.exports = {
  userStore,
  moodStore,
  storage
}
