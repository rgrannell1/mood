
import path from 'path'
import api from 'jsonbin-io-api'
import constants from './constants.js'
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
