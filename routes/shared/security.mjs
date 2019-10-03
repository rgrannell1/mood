
import constants from './constants.mjs'

import * as crypto from 'crypto'
import errors from '@rgrannell/errors'

const security = {
  user: {},
  moods: {}
}

security.encrypt = (datum, key) => {
  const buffer = Buffer.from(JSON.stringify(datum))

  const initVector = crypto.randomBytes(constants.security.initVectorSize)
  const cipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector);

  const result = Buffer.concat([initVector, cipher.update(buffer), cipher.final()])

  return result
}

security.decrypt = (string, key) => {
  if (typeof string === 'undefined') {
    throw new errors.internalServerError('tried to decrypt undefined value', 500)
  }

  const initVector = string.slice(0, constants.security.initVectorSize)
  const encrypted = string.slice(constants.security.initVectorSize)
  const decipher = crypto.createCipheriv(constants.security.encryptAlgorithm, key, initVector)

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return result
}

security.user.encrypt = (obj, key) => {
  return {
    userId: security.encrypt(obj.userId, key),
    ips: security.encrypt(obj.ips, key),
    forwardedFor: security.encrypt(obj.forwardedFor, key),
    trackingIdCount: security.encrypt(obj.trackingIdCount, key),
    moods: security.encrypt(obj.moods || [], key)
  }
}

security.user.decrypt = (obj, key) => {
  return {
    userId: security.decrypt(obj.userId, key),
    ips: security.decrypt(obj.ips, key),
    forwardedFor: security.decrypt(obj.forwardedFor, key),
    trackingIdCount: security.decrypt(obj.trackingIdCount, key),
    moods: security.encrypt(obj.moods || [], key)
  }
}

export default security
