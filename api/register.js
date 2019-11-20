
const { routeMethod } = require('../routes/shared/routes')
const postRegister = require('../routes/post-register')

const methods = new Map()

methods.set('POST', postRegister)

const register = routeMethod(methods, {
  url: '/api/register'
})

module.exports = register
