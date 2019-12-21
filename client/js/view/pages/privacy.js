
import { html } from 'lit-html'

import components from '../components'

/**
 * Construct the privacy policy panel.
 *
 * @param {Object} state the application state
 */
components.privacyPolicy = () => {
  return html`
    <section id="mood-policy" class="mood-panel">
    ${components.h2('Privacy Policy')}

    <h3>Password Storage</h3>

    <p>Passwords are stored as bcrypt salted-hashes in Firebase, are not logged, and are never stored in plain-text.</p>

    <h3>User Information Storage</h3>

    <p>User-information is stored in Firebase. As of 1 December 2019, we store:</p>

    <ul>
      <li>an array of hashed forwardedFor headers</li>
      <li>an array of hashed ip headers</li>
      <li>the user's password (as described above)</li>
      <li>the username and userid</li>
      <li>the total number of requests made by the user</li>
      <li>any submitted moods and their corresponding timestamps</li>
    </ul>

    <p>This information is presently not encrypted when stored.</p>

    <h3>Information Usage</h3>

    <p>The information listed above is stored in Firebase, but won't be shared with any other third-parties. The following fields may be used for security purposes:</p>

    <ul>
      <li>an array of hashed forwardedFor headers</li>
      <li>an array of hashed ip headers</li>
      <li>the total number of requests made by the user</li>
    </ul>

    </section>
  `
}

/**
 * Create the privacy-page component
 *
 * @returns {HTML} index-page
 */
const privacyPage = (pages, state) => {
  if (!state.privacy) {
    state.privacy = {}
  }

  state.page = 'privacy'

  return components.page(components.privacyPolicy(), pages, state)
}

export default privacyPage
