
import local from './local'

async function sendEvents() {
  console.log(`⛏ syncing events to server`)
  const events: Array<any> = local.get('cached-events')

  const body = JSON.stringify({ events }, null, 2)

  return fetch('api/save-mood', {
    method: 'POST',
    body
  })
}

export { sendEvents }
