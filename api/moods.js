
import { routeMethod } from '../routes/shared/shared.js'

const methods = new Map()

methods.set('GET', require('../routes/get-moods'))
methods.set('PATCH', require('../routes/patch-moods'))

export default routeMethod(methods)
