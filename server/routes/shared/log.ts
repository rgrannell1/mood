
import signale from 'signale'

interface Context {

}

const attachContext = (ctx: Context, message:string) => {
  return message
}

export const success = (ctx:Context, message:string) => signale.success(attachContext(ctx, message))
export const debug = (ctx:Context, message:string) => signale.debug(attachContext(ctx, message))
export const error = (ctx:Context, message:string) => signale.error(attachContext(ctx, message))
export const warn = (ctx:Context, message:string) => signale.warn(attachContext(ctx, message))
