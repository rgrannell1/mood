
import * as firebase from './shared/db'
import ensureLoggedIn from './shared/signin'

const getMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  const moods = await firebase.getMoods(userId)

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods
