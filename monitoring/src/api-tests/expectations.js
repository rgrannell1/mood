
const errors = require('@rgrannell/errors')

const expectations = {}

expectations.validResponseFields = async (route, result, fields) => {
  const body = await result.text()

  try {
    var parsed = JSON.parse(body)
  } catch (err) {
    throw errors.invalidResponseBody(`${route} body did not parse as JSON`)
  }

  for (const field of fields) {
    if (!parsed.hasOwnProperty(field)) {
      throw errors.invalidResponseBody(`${route} body did not have property "${field}"`)
    }
  }

  return parsed
}

expectations.validStatusCode = async (route, result, codes = [200]) => {
  // -- check the status works as expected
  if (result.status !== 200) {
    const responseBody = await result.text()
    throw errors.invalidStatusCode(`GET api/moods returned unexpected status-code ${result.status}:\n${responseBody}`)
  }
}

module.exports = expectations
