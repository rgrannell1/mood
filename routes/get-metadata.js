
const package = require('../package.json')

export default async (req, res) => {
  const body = {
    description: 'mood\'s api',
    version: package.version
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body, null, 2))
}
