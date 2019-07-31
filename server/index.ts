
const config = require('@rgrannell/config')
const signale = require('signale')
const Koa = require('koa')
const koaStatic = require('koa-static')

const constants = require('./constants')

const attachRoutes = {} as any

const nope = feature => {
  return `${feature} 'none'`
}

attachRoutes.security = app => {
  const headers = {
    'Referrer-Policy': 'no-referrer',
    'X-XSS-Protection': '1; mode=block',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Content-Type-Options': 'nosniff',
    // -- this is just silly
    'Feature-Policy': [
      'accelerometer',
      'ambient-light-sensor',
      'autoplay',
      'camera',
      'document-domain',
      'execution-while-not-rendered',
      'fullscreen',
      'geolocation',
      'gyroscope',
      'magnetometer',
      'microphone',
      'midi',
      'payment',
      'picture-in-picture',
      'speaker',
      'sync-xhr',
      'usb',
      'vibrate',
      'wake-lock',
      'xr'
    ].map(nope).join('; ')
  }

  app.use(async (ctx, next) => {
    for (const [header, value] of Object.entries(headers)) {
      ctx.set(header, value)
    }

    await next()
  })
}

attachRoutes.public = app => {
  app.use(koaStatic('../public'))
}

const main = async () => {
  const env = config('development')

  const app = new Koa()

  attachRoutes.security(app)
  attachRoutes.public(app)

  app.listen(env.port)
  signale.debug(`server running at http://localhost:${env.port}`)
}

main()
