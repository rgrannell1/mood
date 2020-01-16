
import { routeMethod } from '../routes/shared/routes'
import getMetadata from '../routes/get-metadata'

const methods = new Map()

methods.set('GET', getMetadata)

const metadata = routeMethod(methods, {
  url: '/api/metadata'
})

export default metadata
