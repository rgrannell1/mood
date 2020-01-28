
declare module '@rgrannell/errors' {
  export function authorization(message:string, code:number):Error
  export function badRequest(message:string, code:number):Error
  export function internalServerError(message:string, code:number):Error
  export function methodNotAllowed(message:string, code:number):Error
  export function notFound(message:string, code:number):Error
  export function requestEntityTooLarge(message:string, code:number):Error
  export function unauthorized(message:string, code:number):Error
  export function unprocessableEntity(message:string, code:number):Error
}
