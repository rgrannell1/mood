
const signale = require('signale')
const sslLabs = require('@rgrannell/ssl-labs')

const passingGrades = new Set([
  'A+'
])

/**
 *
 * Check the TLS status of the website
 *
 */
const checkTls = async host => {
  const result = await sslLabs().scan(host)

  const [endpoint] = result.endpoints
  const grade = endpoint.grade

  if (passingGrades.has(grade)) {
    signale.success(`site "${host}" passed with TLS grade ${grade}`)
  } else {
    signale.fatal(`site "${host}" passed with TLS grade ${grade}`)
  }
}

module.exports = checkTls
