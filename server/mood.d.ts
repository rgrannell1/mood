
export {}

declare global {
  type MoodRequest = RequestState & { state:RequestState } & {
    body: any,
    headers: { [key: string]: any },
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  }
  type MoodError = Error & {
    code?: string | number
  }
  type MoodResponse = Response & ResponseMethods
  interface RequestState {
    trackingId?: string,
    ip?: string,
    forwardedFor?: string,
    userAgent?: string,
    url?: string,
    userId?: string
  }
  interface ResponseMethods {
    status: any,
    end: any,
    setHeader: any,
    writeHead: any
  }

  interface UserCredentials {
    username: string,
    password: string
  }
}
