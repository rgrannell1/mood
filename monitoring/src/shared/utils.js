
const utils = {}

utils.getMoods = async (db, userId) => {
  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  if (!doc.exists) {
    return {
      moods: [],
      stats: {
        count: 0
      }
    }
  }

  return doc.data().moods
}

utils.deleteMoods = async (db, userId) => {
  return utils.patchMoods(db, userId, [])
}

utils.patchMoods = async (db, userId, moods) => {
  const ref = db.collection('userdata').doc(userId)
  const doc = await ref.get()

  const existing = doc.data()
  const updated = {
    ...existing,
    moods,
    roles: {
      [userId]: 'reader'
    }
  }

  await db.collection('userdata').doc(userId).update(updated)
}

utils.data = {
  moods: [
    {
      type: 'send-mood',
      id: 'Decent 1500000000000',
      timestamp: 1500000000000,
      mood: 'Decent'
    },
    {
      type: 'send-mood',
      id: 'Neutral 1400000000000',
      timestamp: 1400000000000,
      mood: 'Neutral'
    }
  ]
}

module.exports = utils
