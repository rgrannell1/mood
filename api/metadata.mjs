
import { routeMethod } from '../routes/shared/routes.mjs'

import getMetadata from '../routes/get-metadata.mjs'

const methods = new Map()

methods.set('GET', getMetadata)

const metadata = routeMethod(methods, {
  url: '/api/metadata'
})

export default metadata
