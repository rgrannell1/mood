
/**
 * Get application metadata
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 */
const getMetadata = async (req, res) => {
  const body = {
    description: 'mood\'s api',
    version: 'alpha'
  }

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body, null, 2))
}

export default getMetadata
