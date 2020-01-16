
import { routeMethod } from '../routes/shared/routes'
import getMoods from '../routes/get-moods'
import patchMoods from '../routes/patch-moods'
import deleteMoods from '../routes/delete-moods'

const methods = new Map()

methods.set('GET', getMoods)
methods.set('PATCH', patchMoods)
methods.set('DELETE', deleteMoods)

const moods = routeMethod(methods, {
  url: '/api/moods'
})

export default moods
