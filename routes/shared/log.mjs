
import signale from 'signale'

const attachContext = (ctx, message) => {
  return message
}

const log = { }

for (const level of ['success', 'debug', 'error', 'warn']) {
  log[level] = (ctx, message) => signale[level](attachContext(ctx, message))
}

export default log
