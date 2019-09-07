
import { routeMethod } from './shared/routes'
import getMetadata from './routes/get-metadata'

const methods = new Map()

methods.set('GET', getMetadata)

const metadata = routeMethod(methods)

export default metadata
