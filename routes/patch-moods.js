
import jsonbin from './shared/jsonbin.js'

const patchMoods = async (req, res) => {
  const {userId} = await ensureLoggedIn(req, res)

  moodStore.create(userId)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
