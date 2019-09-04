
import {
  userStore,
  moodStore,
  storage
} from './shared/jsonbin.js'
import ensureLoggedIn from './shared/signin'

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  await storage.createUser(userId)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
