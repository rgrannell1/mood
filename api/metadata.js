
import { routeMethod } from '../routes/shared/shared.js'

const methods = new Map()

methods.set('GET', require('../routes/get-metadata'))

export default routeMethod(methods)
