
import * as log from '../shared/log'

/**
 * Add ip addresses
 *
 * @param old {string[]} saved ip addresses
 * @param current {string?} the current ip address
 *
 * @returns {string[]} the ip addresses
 */
const addCurrentIp = (old:string[] | undefined, current:string | undefined) => {
  const ips = old || []
  if (current && !ips.includes(current)) {
    ips.push(current)
  }

  return ips
}

/**
 * Add forwarded-for addresses
 *
 * @param old {string[]} saved forwarded-for addresses
 * @param current {string?} the current forwarded for address
 *
 * @returns {string[]} the forwarded for addresses
 */
const addCurrentForwardedFor = (old: string[] | undefined, current: string | undefined) => {
  const forwardedFor = old || []
  if (current && !forwardedFor.includes(current)) {
    forwardedFor.push(current)
  }

  return forwardedFor
}

/**
 * Update the user's tracking-id count
 *
 * @param trackingIdCount {number} the current tracking id count
 * @param ctx {object} the request state
 */
const updateTrackingIdCount = (trackingIdCount:number | undefined, ctx: RequestState) => {
  if (typeof trackingIdCount === 'undefined' || isNaN(trackingIdCount)) {
    log.debug(ctx, `trackingIdCount was undefined / NaN (${trackingIdCount})`)
    return 1
  } else {
    return trackingIdCount + 1
  }
}

/**
 * Return a registration date for the user
 *
 * @param current {Date} the current date
 */
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
    trackingIdCount: updateTrackingIdCount(data.trackingIdCount, ctx),
    registeredOn: getRegistrationDate(data.registeredOn),
    username: data.username,
    password: data.password,
    userId: data.userId,
    roles: data.roles,
    moods: data.moods
  }

  return updatedUserData
}

export default updateUserProfile
