
const signale = require('signale')

const validate = {
  get: {
    moods: {},
    metadata: {}
  },
  patch: {
    moods: {}
  },
  delete: {
    moods: {}
  }
}

validate.get.moods.body = body => {

}

validate.get.metadata.body = body => {
  if (!body.hasOwnProperty('version')) {
    signale.warn('GET /api/metadata was missing property "version"')
  }
}

module.exports = validate
