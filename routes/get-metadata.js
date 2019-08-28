
const package = require('../package.json')

const getMetadata = async (req, res) => {
  const body = {
    description: 'mood\'s api',
    version: package.version
  }

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body, null, 2))
}

export default getMetadata
