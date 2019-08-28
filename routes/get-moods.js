
const getMoods = async (_, res) => {
  res.status(200)
  res.end('GET api/moods')
}

export default getMoods
