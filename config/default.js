
const expect = {}

expect.variables = names => {
  for (const name of names) {
    if (!process.env[name]) {
      throw new Error(`environmental variable ${name} was missing.`)
    }
  }
}

module.exports = () => {
  expect.variables([
    'GOOGLE_CLIENT_ID',
    'JSONBIN_API_KEY'
  ])

  return {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID
    },
    jsonbin: {
      key: process.env.JSONBIN_API_KEY
    }
  }
}
