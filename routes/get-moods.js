
const firebase = require('./shared/db')
const ensureLoggedIn = require('./shared/signin')

const getMoods = async (req, res) => {
  const { userId } = await ensureLoggedIn(req, res)

  const moods = await firebase.getMoods(userId, req.state, {

  })

console.log(req.qs)

  res.status(200)
  res.end(JSON.stringify(moods))
}

export default getMoods
