/* eslint-env mocha */

const tap = require('tap')
const path = require('path')

const constants = {
  paths: {
    log: path.join(__dirname, '../routes/shared/log.js')
  }
}

const td = require('testdouble')

const examples = {
  users: {},
  sessions: {}
}

examples.users.valid = [
  {
    forwardedFor: ['test'],
    ips: ['test'],
    moods: []
  }
]

examples.users.invalid = [
  {
    moods: []
  },
  {
    forwardedFor: [],
    moods: []
  },
  {
    forwardedFor: [],
    ips: [],
    moods: {}
  }
]

examples.sessions.valid = [
  {
    username: 'santa',
    sessionId: '................'
  }
]

examples.sessions.invalid = [
  {
    username: 'f'
  },
  {
    username: 'santa',
    sessionId: '.'
  }
]

const tests = {}

tests.validUsers = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  for (const user of examples.users.valid) {
    validate.db.user(user)
    tap.pass('user parsed as expected')
  }

  td.reset()
}

tests.invalidUsers = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  for (const user of examples.users.invalid) {
    tap.throws(() => validate.db.user(user))
  }

  td.reset()
}

tests.validSessions = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  for (const session of examples.sessions.valid) {
    validate.db.session(session)
    tap.pass('session parsed as expected')
  }

  td.reset()
}

tests.invalidSessions = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  for (const session of examples.sessions.invalid) {
    tap.throws(() => validate.db.session(session))
  }

  td.reset()
}

tests.getValidMetadataBody = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  validate.output.get.metadata.body({
    version: 'v1'
  })

  td.reset()
}

tests.getInvalidMetadataBody = () => {
  td.replace(constants.paths.log, {
    warn (ctx, message) {
      throw new Error(message)
    }
  })

  const validate = require('../routes/shared/validate')

  tap.throws(() => {
    validate.output.get.metadata.body({

    })
  })

  td.reset()
}

tests.validRegisterCredentials = () => {
  const validate = require('../routes/shared/validate')

  const body = JSON.stringify({
    user: 'abc',
    password: '..............'
  })

  validate.input.registerCredentials({ body })
}

tests.invalidRegisterCredentials = () => {
  const validate = require('../routes/shared/validate')

  tap.throws(() => {
    validate.input.registerCredentials({ body: '{' })
  })
}

tests.validUsers()
tests.invalidUsers()

tests.validSessions()
tests.invalidSessions()

tests.getValidMetadataBody()
tests.getInvalidMetadataBody()

//tests.validRegisterCredentials()
//tests.invalidRegisterCredentials()
