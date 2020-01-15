
import signale from 'signale'

const attachContext = (ctx, message) => {
  return message
}

const log = { }

// -- create each logger
for (const level of ['success', 'debug', 'error', 'warn']) {
  log[level] = (ctx, message) => signale[level](attachContext(ctx, message))
}

module.exports = log
