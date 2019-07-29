
console.log(`⛏ service-worker started`)

self.addEventListener('install', event => {
  console.log('⛏ installed')
})

self.addEventListener('activate', event => {
  clients.claim()
  console.log('⛏ activated')
})

self.addEventListener('message', event => {
  console.log(`⛏ recieved message: ${event.data}`)
})
