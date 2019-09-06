
import signale from 'signale'

import firebase from './shared/db'
import ensureLoggedIn from './shared/signin'

const patchMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  await firebase.createUser(userId, req.state)

  signale.success(`created storage for user ${userId}`)

  res.status(200)
  res.end('PATCH api/moods')
}

export default patchMoods
