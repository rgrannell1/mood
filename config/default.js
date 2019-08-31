
module.exports = () => {
  if (!process.env.JSONBIN_API_KEY) {
    throw new Error('environmental variable JSONBIN_API_KEY was missing.')
  }

  return {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID
    },
    jsonbin: {
      key: process.env.JSONBIN_API_KEY
    }
  }
}
