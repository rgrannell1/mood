
const config = require('@rgrannell/config')
const signale = require('signale')
const Koa = require('koa')
const koaStatic = require('koa-static')

const constants = require('./constants')

const main = async () => {
  const env = config('development')

  const app = new Koa()

  app.use(koaStatic('../public'))

  app.listen(env.port)
  signale.debug(`server running at http://localhost:${env.port}`)
}

main()
