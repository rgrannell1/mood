
const fetch = require('node-fetch')
const dotenv = require('dotenv').config()

const errors = require('@rgrannell/errors')

const api = {
  get: {},
  delete: {},
  patch: {},
  post: {}
}

const retrieveCookie = async credentials => {
  const result = await api.post.login(credentials)

  if (result.status !== 200) {
    throw errors.invalidStatusCode(`expected a 200 response while logging in but received ${result.status}`)
  }

  const headers = [...result.headers.entries()]
  const [_, cookies] = headers.find(pair => pair[0] === 'set-cookie')

  if (!cookies.includes('mood-session.sig')) {
    throw errors.invalidCookie('missing mood-session.sig')
  }
  if (!cookies.includes('mood-session')) {
    throw errors.invalidCookie('missing mood-session')
  }

  // node-fetch merges the cookies in an odd-way
  return cookies
    .replace(', mood-session.sig', '; mood-session.sig')
    .replace(', mood-session', '; mood-session')
}

/**
 * create an API client for mood.
 *
 * @param {string} host the API host
 */
const moodApi = async host => {
  const { TEST_ACCOUNT_USER, TEST_ACCOUNT_PASSWORD } = dotenv.parsed

  api.post.login = body => {
    return fetch(`${host}/api/login`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  const defaultCookie = await retrieveCookie({
    user: TEST_ACCOUNT_USER,
    password: TEST_ACCOUNT_PASSWORD
  })

  api.get.moods = cookie => {
    const cookieValue = typeof cookie === 'undefined'
      ? defaultCookie
      : cookie

    return fetch(`${host}/api/moods`, {
      headers: {
        Cookie: cookieValue
      }
    })
  }

  api.get.metadata = cookie => {
    return fetch(`${host}/api/metadata`)
  }

  api.delete.moods = cookie => {
    const cookieValue = typeof cookie === 'undefined'
      ? defaultCookie
      : cookie

    return fetch(`${host}/api/moods`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieValue
      }
    })
  }

  api.patch.moods = (body, cookie) => {
    const cookieValue = typeof cookie === 'undefined'
      ? defaultCookie
      : cookie

    return fetch(`${host}/api/moods`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieValue
      },
      body: JSON.stringify(body)
    })
  }

  api.post.register = (body, cookie) => {
    const cookieValue = typeof cookie === 'undefined'
      ? defaultCookie
      : cookie

    return fetch(`${host}/api/register`, {
      method: 'POST',
      headers: {
        Cookie: cookieValue
      },
      body: JSON.stringify(body)
    })
  }

  return api
}

module.exports = moodApi
