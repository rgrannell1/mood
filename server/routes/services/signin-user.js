
const errors = require('@rgrannell/errors')

const firebase = require('../shared/db')
const security = require('../shared/security')
const {
  userId
} = require('../shared/utils')

/**
 * Sign-in a registered user
 *
 * @param {Object} credentials
 * @param {*} ctx
 */
const signinUser = async ({ userName, password }, ctx) => {
  const db = firebase.database()

  const ref = db.collection('userdata').doc(userName)
  const doc = await ref.get()
  const data = doc.data()

  const userExists = doc.exists

  if (!userExists) {
    throw errors.unauthorized('user does not exist', 401)
  }

  const isSame = await security.checkPassword(data.password, password)

  if (isSame) {
    ctx.userId = userId()
  } else {
    throw errors.unauthorized('invalid password provided', 401)
  }

  return firebase.session.create(userName, ctx, {})
}

module.exports = signinUser