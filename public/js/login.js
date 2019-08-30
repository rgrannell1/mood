
gapi.load('auth2', () => {
  gapi.auth2.init()
})

const onSignIn = googleUser => {
  const profile = googleUser.getBasicProfile()

  console.log('Name: ' + profile.getName())
  console.log('Image URL: ' + profile.getImageUrl())
  console.log('Email: ' + profile.getEmail())
}
