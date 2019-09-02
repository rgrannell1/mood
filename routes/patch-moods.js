
import jsonbin from './shared/jsonbin.js'

const patchMoods = async (_, res) => {
  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
