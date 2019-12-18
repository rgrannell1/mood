/* eslint-env mocha */

const validate = require('../routes/shared/validate')

const examples = {
  users: {}
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
    moods: {

    }
  }
]

describe('validate.db.user', () => {
  it('should pass valid users', () => {
    for (const user of examples.users.valid) {
      validate.db.user(user)
    }
  })

  it('should fail invalid users', () => {
    for (const user of examples.users.invalid) {
      validate.db.user(user)
    }
  })
})
