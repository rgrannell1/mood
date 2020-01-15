
const expect = {}

/**
 * Ensure required variables are present
 *
 * @param {Array<string>} names an array of variable names
 */
expect.variables = names => {
  const vars = Object.keys(process.env).join('\n')

  for (const name of names) {
    const val = process.env[name]
    if (!val) {
      throw new Error(`environmental variable ${name} was missing. Available variables are:\n${vars}`)
    }

    if (val.startsWith('"') || val.startsWith("'")) {
      throw new Error(`environmental variable ${name} started with a quote`)
    }
  }
}

/**
 * Read and parse a Google private key
 *
 * @param {Buffer} content
 */
const parseGooglePrivateKey = content => {
  return JSON.parse(Buffer.from(content, 'base64'))
}

/**
 * Read an environmental variable
 *
 * @param {string} name the name of the environmental variable
 */
const readVariable = name => {
  return process.env[name] || process.env[name.toLowerCase()]
}

/**
 * Application configuration
 */
module.exports = () => {
  expect.variables([
    'COOKIE_KEY',
    'ENCRYPTION_KEY',
    'GOOGLE_PRIVATE_KEY',
    'TEST_ACCOUNT_CREDENTIAL'
  ])

  return {
    test: {
      credential: readVariable('TEST_ACCOUNT_CREDENTIAL')
    },
    cookies: {
      keys: [readVariable('COOKIE_KEY')]
    },
    google: {
      db: 'https://mood-251413.firebaseio.com',
      privateKey: parseGooglePrivateKey(readVariable('GOOGLE_PRIVATE_KEY'))
    },
    encryption: {
      key: readVariable('ENCRYPTION_KEY')
    }
  }
}