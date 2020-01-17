import { trackingId } from "../shared/utils"

const addCurrentIp = (old:string[] | undefined, current:string | undefined) => {
  const ips = old || []
  if (current && !ips.includes(current)) {
    ips.push(current)
  }

  return ips
}

const addCurrentForwardedFor = (old: string[] | undefined, current: string | undefined) => {
  const forwardedFor = old || []
  if (current && !forwardedFor.includes(current)) {
    forwardedFor.push(current)
  }

  return forwardedFor
}

const updateTrackingIdCount = (trackingIdCount:number | undefined) => {
  if (typeof trackingIdCount === 'undefined' || isNaN(trackingIdCount)) {
    return 1
  } else {
    return trackingIdCount++
  }
}

const getRegistrationDate = (current:Date) => {
  return current || new Date()
}

/**
 * Update user-information any time a request is made.
 *
 * @param data
 * @param ctx
 */
const updateUserProfile = (data: any, ctx: RequestState): MoodUser => {
  const updatedUserData = {
    ips: addCurrentIp(data.ips, ctx.ip),
    forwardedFor: addCurrentForwardedFor(data.forwardedFor, ctx.forwardedFor),
    trackingIdCount: updateTrackingIdCount(data.trackingId),
    registeredOn: getRegistrationDate(data.registeredOn),
    userName: data.userName,
    password: data.password,
    userId: data.userId,
    roles: data.roles,
    moods: data.moods
  }

  return updatedUserData
}

export default updateUserProfile
