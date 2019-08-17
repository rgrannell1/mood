
async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('./../service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

const model = {}

model.event = elem => {
  return {
    type: 'select-emotion',
    mood: elem.title
  }
}

async function main () {
  await registerServiceWorker()

  document.querySelectorAll('.mood').forEach(elem => {
    elem.onclick = event => {
      const body = JSON.stringify(model.event(event.target))

      fetch('api/save-mood.ts', {
        method: 'POST',
        body,
      }).then(res => {
        console.log(res)
      })
    }
  })
}

main()