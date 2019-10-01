
import firebase from './shared/db.mjs'
import ensureLoggedIn from './shared/signin.mjs'

const getMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  const moods = await firebase.getMoods(userId, req.state, {

  })

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods