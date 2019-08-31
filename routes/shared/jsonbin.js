
import api from 'jsonbin-io-api'
import config from '@rgrannell/config'

const environment = 'default'
const values = config(environment)

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
