
import moodGraphs from '../view/mood-graphs.js'
import { render, html } from 'lit-html'
import { local } from '../shared/utils.js'
import constants from '../shared/constants.js'

const components = {}

components.h2 = title => {
  return html`<h2 class="mood-h2">${title}</h2>`
}

/**
 * Construct a page around a central component.
 *
 * @param {Object} state the application state
 */
components.page = (main, pages, state) => {
  return html`
    <div @click=${components.page.onOpacityClick(state)} id="screen-opacity" style="visibility: hidden;"></div>
    <div class="grid-container">
      ${components.header(state)}
      ${components.menu(pages, state)}
      <main>
      ${main}
      </main>
    </div>
  `
}

components.page.onOpacityClick = state => components.header.onBurgerMenuClick(state)

/**
 * Construct the page header.
 *
 * @param {Object} state the application state
 */
components.header = state => {
  return html`
    <header>
      <nav id="mood-header">
        <div id="nav-menu" @click=${components.header.onBurgerMenuClick(state)}>☰</div>
        <a href="/"><h1 id="brand">mood.</h1></a>
        <div id="dark-mode-toggle" class="dark-mode-toggle" @click=${toggleTheme(state)}>🌙</div>
        </nav>
    </header>`
}

components.header.onBurgerMenuClick = state => () => {
  const $opacity = document.getElementById('screen-opacity')
  const $menu = document.getElementById('menu')

  if (!$opacity) {
    console.error('$opacity missing')
  }
  if (!$menu) {
    console.error('$menu missing')
  }

  toggleVisibility($opacity)
  toggleVisibility($menu)
}

components.menuHome = (pages, state) => {
  return html`<li class="menu-item" id="menu-home" @click=${components.menu.onHomeClick(pages, state)}>🏠 Home</li>`
}

components.menuEdit = (pages, state) => {
  return html`<li class="menu-item" id="menu-edit" @click=${components.menu.onEditClick(pages, state)}>✏️ Edit</li>`
}

components.menuRegister = (pages, state) => {
  return html`<li class="menu-item" id="menu-register" @click=${components.menu.onRegisterClick(pages, state)}>👤 Register</li>`
}

components.menuLogout = (pages, state) => {
  return html`<li class="menu-item" id="menu-logout" @click=${components.menu.onLogoutClick(pages, state)}>❌ Logout</li>`
}

components.menuPrivacy = (pages, state) => {
  return html`<li class="menu-item" id="menu-privacy" @click=${components.menu.onPrivacyClick(pages, state)}>🔒 Privacy</li>`
}

components.menuDarkMode = (pages, state) => {
  return html`<li class="menu-item" id="menu-dark-mode-toggle" @click=${ toggleTheme(state) }>🌙 Dark Mode </li>`
}

components.menuVersion = (pages, state) => {
  return html`<li class="menu-item" id="menu-version"><p>mood version ${constants.version}</p></li>`
}

components.menuDivider = () =>{
  return html`<li><div class='nav-divider'></div></li>`
}

/**
 * Construct the side-menu (hidden by default)
 *
 * @param {Object} pages a reference to the other pages
 * @param {Object} state the application state
 */
components.menu = (pages, state) => {
  let listItems = []

  if (state.isLoggedIn) {
    listItems = [
      components.menuHome(pages, state),
      components.menuEdit(pages, state),
      components.menuRegister(pages, state),
      components.menuLogout(pages, state),
      components.menuPrivacy(pages, state),
      components.menuDivider(),
      components.menuDarkMode(pages, state),
      components.menuVersion(pages, state)
    ]
  } else {
    listItems = [
      components.menuHome(pages, state),
      components.menuRegister(pages, state),
      components.menuPrivacy(pages, state),
      components.menuDivider(),
      components.menuDarkMode(pages, state),
      components.menuVersion(pages, state)
    ]
  }

  return html`<nav id="menu" style="visibility: hidden;">
    <ul>${listItems}</ul>
  </nav>`
}

components.menu.onPrivacyClick = (pages, state) => () => {
  render(pages.privacy(pages, state), document.body)
}

components.menu.onRegisterClick = (pages, state) => () => {
  render(pages.register(pages, state), document.body)
}

components.menu.onLogoutClick = (pages, state) => () => {
  document.cookie = ''
  localStorage.clear()

  render(pages.signin(pages, state), document.body)
}

components.menu.onHomeClick = (pages, state) => () => {
  render(pages.main(pages, state), document.body)
  moodGraphs.refreshMoodGraphs(state)
}

components.menu.onEditClick = (pages, state) => () => {
  render(pages.edit(pages, state), document.body)
}

const toggleTheme = state => () => {
  const storedScheme = local.get('theme')

  const $html = document.querySelector('html')
  const theme = storedScheme || 'light'
  const newTheme = theme === 'light'
    ? 'dark'
    : 'light'

  $html.setAttribute('data-theme', newTheme)
  local.set('theme', newTheme)

  moodGraphs.refreshMoodGraphs(state)

  if (newTheme === 'dark') {
    document.querySelector('#dark-mode-toggle').textContent = '☀️'
    document.querySelector('#menu-dark-mode-toggle').textContent = '☀️ Light Mode'
  } else {
    document.querySelector('#dark-mode-toggle').textContent = '🌙'
    document.querySelector('#menu-dark-mode-toggle').textContent = '🌙 Dark Mode'
  }
}

const toggleVisibility = $elem => {
  if (!$elem) {
    console.error('$elem missing')
    return
  }

  if ($elem.style.visibility === 'hidden') {
    $elem.style.visibility = ''
  } else {
    $elem.style.visibility = 'hidden'
  }
}

/**
 * Construct the mood graph panel.
 *
 * @param {Object} state the application state
 */
components.moodGraph = () => {
  return html`
    <section id="mood-graph" class="mood-panel">
      ${components.h2('Timeline')}
      <div id="mood-over-time"></div>
    </section>`
}

export default components
