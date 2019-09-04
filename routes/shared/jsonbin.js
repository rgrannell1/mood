
import signale from 'signale'
import api from 'jsonbin-io-api'
import config from './config.js'

const jsonbin = new api(config.jsonbin.key)

export const moodStore = {}

/**
 * create a collection for a user if it does not exist
 *
 * @param {string} userId the user ID
 *
 * @returns {Promise<*>}
 */
moodStore.create = userId => {
  return jsonbin.createCollection({
    data: {
      name: `moods-${userId}`
    }
  })
}

export const userStore = {}

/**
 * create a collection for a user if it does not exist
 *
 * @param {string} userId the user id
 * @param {string} data the event-content to save
 *
 * @returns {Promise<*>}
 */
userStore.create = (userId, data) => {
  return jsonbin.createBin({
    collectionId: `moods-${userId}`,
    data,
    isPrivate: true
  })
}

export const storage = {}

/**
 * @param {string} userId
 */
storage.createUser = userId => {
  await userStore.create(userId)
  await moodStore.create(userId)

  signale.success(`created storage for user ${userId}`)
}
