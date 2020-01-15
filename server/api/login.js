
const { routeMethod } = require('../routes/shared/routes')
const postLogin = require('../routes/post-login')

const methods = new Map()

methods.set('POST', postLogin)

const login = routeMethod(methods, {
  url: '/api/login'
})

module.exports = login
