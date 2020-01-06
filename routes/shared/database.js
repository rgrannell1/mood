
const admin = require('firebase-admin')
const config = require('./config')
const envConfig = config()

admin.initializeApp({
  credential: admin.credential.cert(envConfig.google.privateKey),
  databaseURL: envConfig.google.db
})

const db = admin.firestore()

module.export = () => {
  return db
}
