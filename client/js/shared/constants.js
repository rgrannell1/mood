
const constants = {
  // eslint-disable-next-line no-undef
  version: __webpack_hash__,

  // eslint-disable-next-line no-undef
  staticHost: __STATIC_HOST__,
  // eslint-disable-next-line no-undef
  apiHost: __API_HOST__,
  google: {
    clientId: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com'
  },
  keys: {
    googleToken: 'GOOGLE_ID_TOKEN',
    refreshToken: 'GOOGLE_REFRESH_TOKEN',
    cachedEvents: 'cached-events'
  },
  moodOrdering: [
    'Stellar',
    'Fine',
    'Decent',
    'Neutral',
    'Bad',
    'Ennui',
    'In pain',
    'Atrocious'
  ]
}

export default constants
