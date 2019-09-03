
import jsonbin from './shared/jsonbin.js'
import ensureLoggedIn from './shared/signin'

const patchMoods = async (req, res) => {
  const {userId} = await ensureLoggedIn(req, res)

  moodStore.create(userId)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
