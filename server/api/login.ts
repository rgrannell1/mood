
import { routeMethod } from '../routes/shared/routes'
import postLogin from '../routes/post-login'

const methods = new Map()

methods.set('POST', postLogin)

const login = routeMethod(methods, {
  url: '/api/login'
})

export default login
