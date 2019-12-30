
const chalk = require('chalk')

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

utils.deleteUser = async (db, userId) => {
  const ref = db.collection('userdata').doc(userId)
  return ref.delete()
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

utils.timeoutError = (error, timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error), timeout)
  })
}

/**
 * Navigate to the mood site.
 */
utils.moodPage = async (browser, host) => {
  const context = await browser.createIncognitoBrowserContext()
  const page = await context.newPage()

  await page.goto(host)
  return page
}

utils.interceptRequestResponse = (page, fragment) => {
  return new Promise((resolve, reject) => {
    const pair = {}

    function handleRequest (request) {
      if (request.url().includes(fragment)) {
        pair.request = request
      }
    }

    function handleResponse (response) {
      if (response.url().includes(fragment)) {
        pair.response = response

        page.removeListener('response', handleResponse)

        if (!pair.request) {
          setTimeout(() =>{
            page.removeListener('request', handleRequest)
            if (!pair.request) {
              reject(new Error(`no request matching "${fragment}" found`))
            }

            resolve(pair)
          }, 2000)
        } else {
          page.removeListener('request', handleRequest)
          resolve(pair)
        }
      }
    }

    page
      .on('request', handleRequest)
      .on('response', handleResponse)
  })
}

utils.showHtml = async page => {
  const $html = await page.$('html')
  const text = await page.evaluate(elem => elem.innerHTML, $html);

  console.log(chalk.blue(`\n\n${text}\n\n`))
}

module.exports = utils
