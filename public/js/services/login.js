
const handlers = {}

handlers.onSuccess = () => {
  alert('ready')
}

handlers.onFailure = () => {
  alert('error')
}

const attachSignIn = ($button, api) => {
  api.attachClickHandler($button, {}, handlers.onSuccess, handlers.onFailure)
}

window.onload = function () {
  console.log('setting up google login.')

  if (!gapi) {
    console.error('failed to load gapi')
  }

  gapi.load('auth2', () => {
    const api = gapi.auth2.init({
      clientId: '1053339394516-8m3pa0tvsejqha2usv84rkul7ja804s6.apps.googleusercontent.com'
    })

    const $button = document.querySelector('#google-signin')
    attachSignIn($button, api)
  })
}
