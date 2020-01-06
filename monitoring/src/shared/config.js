
const signale = require('signale')

const environments = {}

environments.local = () => {
  return {
    staticHost: 'http://localhost:4000',
    apiHost: 'http://localhost:4010',
    dbHost: 'https://mood-251413.firebaseio.com'
  }
}

environments.production = () => {
  return {
    staticHost: 'http://mood.rgrannell2.now.sh',
    apiHost: 'http://mood.rgrannell2.now.sh',
    dbHost: 'https://mood-251413.firebaseio.com'
  }
}

module.exports = () => {
  const environment = process.env.NODE_ENV || process.env.node_env

  if (environment in environments) {
    return environments[environment]()
  } else {
    signale.error(`environment "${environment}" not supported.`)
    process.exit(1)
  }
}
