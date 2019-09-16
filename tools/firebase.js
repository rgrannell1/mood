
require('dotenv').config()

const admin = require('firebase-admin')

const command = {
  name: 'firebase',
  dependencies: []
}

command.cli = `
Usage:
  tools firebase --userId=<user-id> (--get)
Description:
  Build
`

command.task = async args => {
  const userId = args['--userId']

  const config = require('../routes/shared/config')()

  admin.initializeApp({
    credential: admin.credential.cert(config.google.privateKey),
    databaseURL: config.google.db
  })

  const db = admin.firestore()

  const ref = db.collection('users').doc(userId)
  const doc = await ref.get()

  console.log(JSON.stringify(doc.data(), null, 2))
}

module.exports = command
