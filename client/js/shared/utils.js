
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
  },
  /**
   * Clear localstorage
   *
   * @returns {undefined}
   */
  clear () {
    localStorage.clear()
  }
}

/**
 * Register the page's service-worker
 *
 * @returns {undefined}
 */
export async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

// TODO: too small, remove
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

/**
 * Format dates into a human-readable format.
 *
 * @param {date} input an input date
 */
export const formatDate = input => {
  const now = dayjs()
  const date = dayjs(input)

  const isThisYear = now.format('YYYY') === date.format('YYYY')
  const isToday = now.format('YYYY MM D') === date.format('YYYY MM D')

  if (isToday) {
    return `Today, ${date.format('HH:mm')}`
  } else if (isThisYear) {
    return `${dayjs(date).format('ddd MMM D')} ${dayjs(date).format('HH:mm')}`
  } else {
    return `${dayjs(date).format('ddd MMM D YYYY')} ${dayjs(date).format('HH:mm')}`
  }
}

/**
 * Toggle the elements visibility
 *
 * @param {DomElement} $elem
 */
export const toggleVisibility = $elem => {
  if (!$elem) {
    console.error('$elem missing')
    return
  }

  if ($elem.style.visibility === 'hidden') {
    $elem.style.visibility = ''
  } else {
    $elem.style.visibility = 'hidden'
  }
}

/**
 * get the heatplot configuration for a theme
 *
 * @param {string} theme the theme to use
 *
 * @returns {object} Vega configuration
 */
export const getGraphConfig = theme => {
  const config = {}

  if (theme === 'dark') {
    Object.assign(config, {
      background: getCssVariable('graph-background'),
      title: {
        color: getCssVariable('graph-light')
      },
      style: {
        'guide-label': {
          fill: getCssVariable('graph-light')
        },
        'guide-title': {
          fill: getCssVariable('graph-light')
        }
      },
      axis: {
        domainColor: getCssVariable('graph-light'),
        gridColor: getCssVariable('graph-medium'),
        tickColor: getCssVariable('graph-light')
      }
    })
  } else {
    Object.assign(config, {})
  }

  return config
}

/**
 *
 * get the value of a css property.
 *
 * @param {string} variable the css variable name
 *
 * @returns {any} the css property value
 */
export const getCssVariable = variable => {
  return window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)
}
