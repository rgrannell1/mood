
import ensureLoggedIn from './shared/signin'

const getMoods = async (req, res) => {
  await ensureLoggedIn(req, res)

  res.status(200)
  res.end('GET api/moods')
}

export default getMoods
