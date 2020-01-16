
import admin from 'firebase-admin'
import config from './config'
const envConfig = config()

admin.initializeApp({
  credential: admin.credential.cert(envConfig.google.privateKey),
  databaseURL: envConfig.google.db
})

const db = admin.firestore()

export default () => {
  return db
}
