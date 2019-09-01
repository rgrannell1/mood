
window.onLoadCallback = function () {
  if (!gapi) {
    console.error('failed to load gapi')
  }

  gapi.load('auth2', () => {
    gapi.auth2.init()
  })
}

const onSignIn = googleUser => {
  const profile = googleUser.getBasicProfile()

}
