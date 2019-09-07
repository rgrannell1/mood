
export type route = (req, res) => Promise<void>

export interface Context {
  userId?: string
  trackingId: string
  ip: string
  forwardedFor: string
  userAgent: string
}

export type ContextRequest = Request & { state: Context }

export interface MoodEntity {
  type: string
  mood: string
  timestamp: number
}

export interface MoodBody {
  events: MoodEntity[]
}
