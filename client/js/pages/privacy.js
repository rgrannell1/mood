
import { render } from 'lit-html'

import pages from '../view/pages.js'
import { registerServiceWorker } from '../shared/utils.js'

/**
 * Run the client-side code
 */
async function main () {
  await registerServiceWorker()
}

main()
const state = {}

render(pages.privacy(state), document.body)
