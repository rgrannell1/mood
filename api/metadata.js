
const package = require('../package.json')

export default async (_, res) => {
  const body = JSON.stringify({
    description: 'mood\'s api',
    version: package.version
  }, null, 2)

  res.setHeader('Content-Type', 'application/json')
  res.end(body)
}
