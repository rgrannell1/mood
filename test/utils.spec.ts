/* eslint-env mocha */

import tap from 'tap'

const utils = require('../routes/shared/utils')
const constants = require('../routes/shared/constants')

const tests = {}

tests.trackingIdLength = () => {
  const result = utils.trackingId()

  tap.equal(result.length, constants.sizes.trackingId)
}

tests.sessionIdLength = () => {
  const result = utils.sessionId()

  tap.equal(result.length, constants.sizes.sessionId)
}

tests.userIdLength = () => {
  utils.userId()
}

tests.hash = () => {
  const hash = utils.hash('test')

  tap.equal('7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==', hash)
}

tests.trackingIdLength()
tests.sessionIdLength()
tests.userIdLength()
tests.hash()
