
import path from 'path'
import api from 'jsonbin-io-api'
import config from '@rgrannell/config'
import constants from './constants.js'

const environment = 'default'
const values = config(environment, {
  root: constants.paths.root
})

const jsonbin = new api(values.jsonbin.key)

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
