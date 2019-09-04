
const expect = {}

/**
 * Ensure required variables are present
 *
 * @param {Array<string>} names an array of variable names
 */
expect.variables = names => {
  for (const name of names) {
    const val = process.env[name]
    if (!val) {
      throw new Error(`environmental variable ${name} was missing.`)
    }

    if (val.startsWith('"') || val.startsWith("'")) {
      throw new Error(`environmental variable ${name} started with a quote`)
    }
  }
}

expect.variables([
  'GOOGLE_CLIENT_ID',
  'JSONBIN_API_KEY'
])

module.exports = {
  google: {
    clientId: process.env.google_client_id,
    audience: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com'
  },
  jsonbin: {
    key: process.env.jsonbin_api_key
  }
}
