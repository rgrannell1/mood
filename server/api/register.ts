
import { routeMethod } from '../routes/shared/routes'
import postRegister from '../routes/post-register'

const methods = new Map()

methods.set('POST', postRegister)

const register = routeMethod(methods, {
  url: '/api/register'
})

export default register
