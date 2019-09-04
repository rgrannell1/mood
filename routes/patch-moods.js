
import {
  userData
} from './shared/jsonbin.js'
import ensureLoggedIn from './shared/signin'

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  await userData.create(userId, {  })

  signale.success(`created storage for user ${userId}`)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
