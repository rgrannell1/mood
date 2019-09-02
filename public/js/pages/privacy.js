
import { render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js'

import pages from '../view/pages.js'
import { registerServiceWorker } from '../shared/utils.js'

/**
 * Run the client-side code
 */
async function main() {
  await registerServiceWorker()
}

main()

render(pages.privacy(), document.body)
