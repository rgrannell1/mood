
import { routeMethod } from '../routes/shared/routes.mjs'

import postLogin from '../routes/post-login.mjs'

const methods = new Map()

methods.set('POST', postLogin)

const login = routeMethod(methods, {
  url: '/api/login'
})

export default login
