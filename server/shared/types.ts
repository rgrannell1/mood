
export type route = (req, res) => Promise<void>

export interface Context {
  trackingId: string
  ip: string
  forwardedFor: string
  userAgent: string
}
