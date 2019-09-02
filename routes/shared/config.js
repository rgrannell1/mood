
const expect = {}

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

export default {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },
  jsonbin: {
    key: process.env.JSONBIN_API_KEY
  }
}
