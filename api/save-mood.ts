
const MongoClient = require('mongodb').MongoClient

const getUrl = () => {
  const {
    mongo_user,
    mongo_password,
    mongo_cluster
  } = process.env

  if (!mongo_user) {
    throw new Error('fatal: environmental variable "mongo_user" missing')
  }
  if (!mongo_password) {
    throw new Error('fatal: environmental variable "mongo_password" missing')
  }
  if (!mongo_cluster) {
    throw new Error('fatal: environmental variable "mongo_cluster" missing')
  }

  return `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_cluster}.mongodb.net/test?retryWrites=true&w=majority`
}

const writeMood = async () => {
  const db = await MongoClient.connect(getUrl(), {
    useNewUrlParser: true
  })
}

export default async (req, res) => {
  try {
    await writeMood()
    res.end('connection opened')
  }
  catch (err) {
    res.end('hello')
  }
}

