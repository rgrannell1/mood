
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
  'GOOGLE_PRIVATE_KEY',
  'TEST_ACCOUNT_CREDENTIAL'
])

const parseGooglePrivateKey = content => {
  return JSON.parse(Buffer.from(content, 'base64'))
}

module.exports = {
  test: {
    credential: process.env.TEST_ACCOUNT_CREDENTIAL
  },
  google: {
    db: 'https://mood-251413.firebaseio.com',
    clientId: process.env.google_client_id || process.env.GOOGLE_CLIENT_ID,
    audience: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com',
    privateKey: parseGooglePrivateKey(process.env.google_private_key || process.env.GOOGLE_PRIVATE_KEY)
  }
}
