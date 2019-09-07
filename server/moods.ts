
import { routeMethod } from './shared/routes'

import getMoods from './routes/get-moods'
import patchMoods from './routes/patch-moods'

const methods = new Map()

methods.set('GET', getMoods)
methods.set('PATCH', patchMoods)

const moods = routeMethod(methods)

export default moods
