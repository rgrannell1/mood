
// -- todo
declare module '@rgrannell/errors' {
  function unprocessableEntity (message: any, code: any)
  function unauthorized (message: any, code: any)
  function requestEntityTooLarge (message: any, code: any)
  function methodNotAllowed (message: any, code: any)
  function internalServerError (message: any, code: any)
}

declare class OAuth2Client {
  constructor (clientId: string)
}

declare module 'google-auth-library' {
  export OAuth2Client
}
