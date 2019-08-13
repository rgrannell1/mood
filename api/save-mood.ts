
const MongoClient = require('mongodb').MongoClient

export default async (req, res) => {
  const {
    mongo_user,
    mongo_password,
    mongo_cluster
  } = process.env

  const url = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_cluster}.mongodb.net/test?retryWrites=true&w=majority`
  const db = await MongoClient.connect(url)

  res.json({
    message: 'hi'
  })
}
