
const nanoid = require('nanoid')

/**
 * Get application metadata
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 *
 */
const getMetadata = async (req, res) => {
  const body = {
    version: `v${nanoid()}`
  }

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body, null, 2))
}

module.exports = getMetadata
