
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
  interface MoodEntry {
    id?: string
    mood: 'Stellar' | 'Fine' | 'Decent' | 'Neutral' | 'Bad' | 'Ennui' | 'In pain' | 'Atrocious',
    timestamp: number,
    type: string
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

  interface FirebaseOpts {
    key: string
  }

  interface ArbitraryObject {
    [key: string]: any
  }

  interface MoodSession {
    username: string,
    sessionId: string
  }
  interface MoodUser {
    ips: string[]
    forwardedFor: string[]
    trackingIdCount: number
    registeredOn: Date
    username: string
    password: string
    userId: string
    roles: { [key: string]: string }
    moods: MoodEntry[]
  }
}
