
import constants from './constants'

import * as crypto from 'crypto'
import * as errors from '@rgrannell/errors'
import bcrypt from 'bcrypt'

/**
 * Check whether a user supplied a valid password
 *
 * @param {string} hash the hashed user password
 * @param {string} password the user's plaintext password
 *
 * @returns {Promise<boolean>} are the passwords the same?
 */
export const checkPassword = async (hash:string, password:string):Promise<boolean> => {
  const isSame = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err:Error, result:boolean) => {
      err ? reject(err) : resolve(result)
    })
  })

  return isSame as boolean
}

/**
 * Hash a user password
 *
 * @param {string} password a user password
 *
 * @returns {Promise<string>} the hashed password
 */
export const hashPassword = async (password:string) => {
  try {
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, constants.security.saltRounds, (err:Error, hash:string) => {
        err ? reject(err) : resolve(hash)
      })
    })

    return hash as string
  } catch (err) {
    throw errors.internalServerError('failed to hash password', 500)
  }
}

/**
 * Encrypt a value
 */
export const encrypt = (datum:any, key:string) => {
  const buffer = Buffer.from(JSON.stringify(datum))

  const initVector = crypto.randomBytes(constants.security.initVectorSize)
  const cipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector)

  const result = Buffer.concat([initVector, cipher.update(buffer), cipher.final()])

  return result
}

export const decrypt = (string:string, key:string) => {
  if (typeof string === 'undefined') {
    throw errors.internalServerError('tried to decrypt undefined value', 500)
  }

  const initVector = string.slice(0, constants.security.initVectorSize)
  const encrypted = string.slice(constants.security.initVectorSize)
  const decipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector)

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return JSON.parse(result.toString())
}

export const user = {
  // UNIMPLEMENTED
  encrypt: (obj:any, key:string) => {
    return obj
  },
  // UNIMPLEMENTED
  decrypt: (obj:any, key:string) => {
    return obj
  }
}
