
type errss = number

declare module '@rgrannell/errors' {
  export function authorization(message:string, code:number|undefined):Error
  export function badRequest(message:string, code:number|undefined):Error
  export function internalServerError(message:string, code:number|undefined):Error
  export function methodNotAllowed(message:string, code:number|undefined):Error
  export function notFound(message:string, code:number|undefined):Error
  export function requestEntityTooLarge(message:string, code:number|undefined):Error
  export function unauthorized(message:string, code:number|undefined):Error
  export function unprocessableEntity(message:string, code:number|undefined):Error
}
