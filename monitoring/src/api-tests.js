
const fetch = require('node-fetch')
const constants = require('./constants')

// -- todo check the api's work as expected

const tests = {
  metadata: {}
}

tests.metadata.get = () => {
  // -- fetch and verify metadata fields
}

tests.moods.get = () => {

}

tests.moods.patch = () => {

}

const apiTests = () => {
  // -- does metadata work?
  // -- does get work?
  // -- does patch then get work?
}

module.exports = apiTests
