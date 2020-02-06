
import day from 'dayjs'

import * as errors from '@rgrannell/errors'

import validate from './validate'
import * as security from './security'
import * as log from './log'

import { sessionId } from './utils'

import createSession from './db/create-session'
import getSession from './db/get-session'
import createUser from './db/create-user'
import deleteMoods from './db/delete-moods'
import getMoods from './db/get-moods'
import saveMoods from './db/save-moods'
import getUser from './db/get-user'

import getDatabase from './database'
const db = getDatabase()

const firebase = {
  session: {
    create: createSession,
    get: getSession

  },
  user: {
    create: createUser,
    get: getUser
  },
  moods: {
    delete: deleteMoods,
    get: getMoods,
    save: saveMoods
  },
  /**
   * Return a firebase data instance.
   *
   * @returns {Database}
   *
   */
  database: () => {
    return db
  }
}


export default  firebase
