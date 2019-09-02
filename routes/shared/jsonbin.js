
import path from 'path'
import api from 'jsonbin-io-api'
import constants from './constants.js'
import config from './config.js'

const jsonbin = new api(config.jsonbin.key)

export const moodStore = {}

moodStore.create = userId => {
  return jsonbin.createCollection({
    data: {
      name: `moods-${userId}`
    }
  })
}

export const userStore = {}

userStore.create = (userId, userData) => {
  return jsonbin.createCollection({
    data: {
      name: `users-${userId}`,
      ...userData
    }
  })
}
