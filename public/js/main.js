
async function registerServiceWorker () {
  try {
    const reg = await navigator.serviceWorker.register('service-worker.js')
    console.log(`registered service-worker: scope is ${reg.scope}`)
  } catch (err) {
    console.error(`failed to register service-worker: ${err.message}`)
  }
}

const model = {}

model.event = elem => {
  return {
    type: 'select-emotion'
  }
}

async function main () {
  if ('serviceWorker' in navigator) {
    await registerServiceWorker()

    const sw = navigator.serviceWorker.controller

    document.querySelectorAll('.mood').forEach(elem => {
      elem.onclick = () => {
        sw.postMessage(model.event(elem))
      }
    })
  }
}

main()
