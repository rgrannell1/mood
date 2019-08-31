
module.exports = () => {
  if (!process.env.JSONBIN_API_KEY) {
    throw new Error('environmental variable JSONBIN_API_KEY was missing.')
  }

  return {
    jsonbin: {
      key: process.env.JSONBIN_API_KEY
    }
  }
}
