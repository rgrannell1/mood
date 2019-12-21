
import day from 'dayjs'
import dayjs from 'dayjs'

/**
 * Typed wrapper for localstorage
 *
 * Remove, not very good.
 */
export const local = {
  /**
   * set a value in localstorage
   *
   * @param {string} key the property name
   * @param {string} value the property value
   */
  set (key, value) {
    return typeof value === 'string'
      ? localStorage.setItem(key, value)
      : localStorage.setItem(key, JSON.stringify(value))
  },
  /**
 * set a value in localstorage
 *
 * @param {string} key the property name
 *
 * @returns {string} the value stored in localstorage
 */
  get (key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (err) {
      return localStorage.getItem(key)
    }
  }
}

export async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

export const model = {
  event (elem) {
    const time = Date.now()
    return {
      // -- todo change to hash.
      id: `${elem.title} ${time}`,
      type: 'send-mood',
      mood: elem.title,
      timestamp: time
    }
  }
}

export const formatDate = input => {
  const now = dayjs()
  const date = dayjs(input)

  const isThisYear = now.format('YYYY') === date.format('YYYY')
  const isToday = now.format('YYYY MM D') === date.format('YYYY MM D')

  if (isToday) {
    return `Today, ${date.format('HH:mm')}`
  } else if (isThisYear) {
    return `${dayjs(date).format('ddd MMM D')} @ ${dayjs(date).format('HH:mm')}`
  } else {
    return `${dayjs(date).format('ddd MMM D YYYY')} @ ${dayjs(date).format('HH:mm')}`
  }
}
