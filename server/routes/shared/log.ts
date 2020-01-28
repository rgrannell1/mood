
import signale from 'signale'

const attachContext = (ctx: RequestState, message: string) => {
  return `user ${ctx.userId || 'unknown'}/${ctx.trackingId}: ${message}`
}

export const success = (ctx: RequestState, message: string) => signale.success(attachContext(ctx, message))
export const debug = (ctx: RequestState, message: string) => signale.debug(attachContext(ctx, message))
export const error = (ctx: RequestState, message: string) => signale.error(attachContext(ctx, message))
export const warn = (ctx: RequestState, message: string) => signale.warn(attachContext(ctx, message))
