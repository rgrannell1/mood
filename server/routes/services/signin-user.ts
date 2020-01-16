
import firebase from '../shared/db'
import * as security from '../shared/security'
import { userId } from '../shared/utils'
import config from '../shared/config'

const envConfig = config()

import errors from '@rgrannell/errors'

/**
 * Sign-in a registered user
 *
 * @param {Object} credentials
 * @param {*} ctx
 */
const signinUser = async ({ username, password }: UserCredentials, ctx:RequestState) => {
  const db = firebase.database()

  const ref = db.collection('userdata').doc(username)
  const doc = await ref.get()
  const data = doc.data()

  const userExists = doc.exists

  if (!data || !userExists) {
    throw errors.unauthorized('user does not exist', 401)
  }

  const isSame = await security.checkPassword(data.password, password)

  if (isSame) {
    ctx.userId = userId()
  } else {
    throw errors.unauthorized('invalid password provided', 401)
  }

  return firebase.session.create(username, ctx, {
    key: envConfig.encryption.key
  })
}

export default signinUser
