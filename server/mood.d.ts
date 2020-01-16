
export {}

declare global {
  type MoodRequest = RequestState & { state:RequestState } & ResponseMethods
  type MoodResponse = Response & ResponseMethods
  interface RequestState {
    trackingId?: string,
    ip?: string,
    forwardedFor?: string,
    userAgent?: string,
    url?: string
  }
  interface ResponseMethods {
    status: any,
    end: any
  }
}
