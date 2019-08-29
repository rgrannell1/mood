
import { routeMethod } from '../routes/shared/shared.js'

const methods = new Map()

import getMoods from '../routes/get-moods'
import patchMoods from '../routes/patch-moods'

methods.set('GET', getMoods)
methods.set('PATCH', patchMoods)

const moods = routeMethod(methods)

export default moods
