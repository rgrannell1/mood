
const { routeMethod } = require('../routes/shared/routes')
const getMoods = require('../routes/get-moods')
const patchMoods = require('../routes/patch-moods')
const deleteMoods = require('../routes/delete-moods')

const methods = new Map()

methods.set('GET', getMoods)
methods.set('PATCH', patchMoods)
methods.set('DELETE', deleteMoods)

const moods = routeMethod(methods, {
  url: '/api/moods'
})

module.exports = moods
