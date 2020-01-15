
import constants from './constants'

import crypto from 'crypto'
const errors = require('@rgrannell/errors')
import bcrypt from 'bcrypt'

const security = {
  user: {},
  moods: {}
}

/**
 * Check whether a user supplied a valid password
 *
 * @param {string} hash the hashed user password
 * @param {string} password the user's plaintext password
 *
 * @returns {Promise<boolean>} are the passwords the same?
 */
security.checkPassword = async (hash, password) => {
  const isSame = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })

  return isSame
}

/**
 * Hash a user password
 *
 * @param {string} password a user password
 *
 * @returns {Promise<string>} the hashed password
 */
security.hashPassword = async password => {
  try {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, constants.security.saltRounds, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    })
  } catch (err) {
    throw errors.internalServerError('failed to hash password', 500)
  }
}

/**
 * Encrypt a value
 */
security.encrypt = (datum, key) => {
  const buffer = Buffer.from(JSON.stringify(datum))

  const initVector = crypto.randomBytes(constants.security.initVectorSize)
  const cipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector)

  const result = Buffer.concat([initVector, cipher.update(buffer), cipher.final()])

  return result
}

security.decrypt = (string, key) => {
  if (typeof string === 'undefined') {
    throw errors.internalServerError('tried to decrypt undefined value', 500)
  }

  const initVector = string.slice(0, constants.security.initVectorSize)
  const encrypted = string.slice(constants.security.initVectorSize)
  const decipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector)

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return JSON.parse(result.toString())
}

// UNIMPLEMENTED
security.user.encrypt = (obj, key) => {
  return obj
}

// UNIMPLEMENTED
security.user.decrypt = (obj, key) => {
  return obj
}

module.exports = security
