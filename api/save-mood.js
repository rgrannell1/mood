
const MongoClient = require('mongodb').MongoClient

/**
 * Get the mongodb connection URL.
 */
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

/**
 * Write mood data to MongoDB
 */
const writeEvents = async () => {
  const db = await MongoClient.connect(getUrl(), {
    useNewUrlParser: true
  })
}

export default async (_, res) => {
  try {
    await writeEvents()
    res.end('connection opened')
  }
  catch (err) {
    res.end(err.message)
  }
}
