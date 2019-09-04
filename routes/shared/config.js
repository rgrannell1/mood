
const expect = {}

/**
 * Ensure required variables are present
 *
 * @param {Array<string>} names an array of variable names
 */
expect.variables = names => {
  for (const name of names) {
    if (!process.env[name]) {
      throw new Error(`environmental variable ${name} was missing.`)
    }
  }
}

expect.variables([
  'GOOGLE_CLIENT_ID',
  'JSONBIN_API_KEY'
])

module.exports = {
  google: {
    clientId: process.env.google_client_id
  },
  jsonbin: {
    key: process.env.jsonbin_api_key
  }
}
