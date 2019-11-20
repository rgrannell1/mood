
const path = require('path')

module.exports = {
  paths: {
    root: path.resolve('../..')
  },
  sizes: {
    trackingId: 16,
    sessionId: 16
  },
  limits: {
    moodsLength: 50
  },
  security: {
    saltRounds: 12,
    initVectorSize: 16,
    encryptAlgorithm: 'aes-256-ctr'
  },
  cookies: {
    session: 'mood-session'
  }
}
