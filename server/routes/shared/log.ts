
import signale from 'signale'

const attachContext = (ctx, message) => {
  return message
}

const logger = (level, ctx, message) => {
  signale[level](attachContext(ctx, message))
}

const log = {
  success: logger.bind(null, 'success'),
  debug: logger.bind(null, 'debug'),
  error: logger.bind(null, 'error'),
  warn: logger.bind(null, 'warn')
}

export default log
