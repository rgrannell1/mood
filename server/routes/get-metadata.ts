
import nanoid from 'nanoid'
import validate from './shared/validate'

/**
 * Get application metadata
 *
 * @param {Request} req a request object
 * @param {Response} res a response object
 *
 */
const getMetadata = async (req: MoodRequest, res: MoodResponse) => {
  const body = {
    // -- TODO update
    version: `v${nanoid()}`
  }

  validate.output.get.metadata.body(body)

  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body, null, 2))
}

export default  getMetadata
