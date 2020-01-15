
const { routeMethod } = require('../routes/shared/routes')
const getMetadata = require('../routes/get-metadata')

const methods = new Map()

methods.set('GET', getMetadata)

const metadata = routeMethod(methods, {
  url: '/api/metadata'
})

module.exports = metadata
