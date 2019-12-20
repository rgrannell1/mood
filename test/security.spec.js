/* eslint-env mocha */

const tap = require('tap')

const security = require('../routes/shared/security')

const tests = {}

// UNIMPLEMENTED
tests.encrypt = () => {
  security.user.encrypt('')
}

// UNIMPLEMENTED
tests.decrypt = () => {
  security.user.decrypt('')
}

tests.encrypt()
tests.decrypt()
