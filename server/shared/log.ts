
import signale from 'signale'
import { Context } from './types'

const attachContext = (ctx: Context, message: string): string => {
  return message
}

const logger = (level: string, ctx: Context, message: string): void => {
  signale[level](attachContext(ctx, message))
}

const log = {
  success: logger.bind(null, 'success'),
  debug: logger.bind(null, 'debug'),
  error: logger.bind(null, 'error'),
  warn: logger.bind(null, 'warn')
}

export default log
