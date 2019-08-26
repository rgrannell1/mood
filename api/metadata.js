
const methods = new Map()

methods.set('GET', require('../routes/get-metadata'))

export default shared.routeMethod(methods)
