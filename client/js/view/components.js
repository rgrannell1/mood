
import moodGraphs from '../view/mood-graphs.js'
import { render, html } from 'lit-html'
import {
  local,
  toggleVisibility
} from '../shared/utils.js'
import constants from '../shared/constants.js'
import logout from '../services/logout.js'

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
  return html`<li class="menu-item" id="menu-home" @click=${components.menuHome.onClick(pages, state)}>🏠 Home</li>`
}

components.menuHome.onClick = (pages, state) => () => {
  render(pages.main(pages, state), document.body)
  moodGraphs.refreshMoodGraphs(state)
}

components.menuEdit = (pages, state) => {
  return html`<li class="menu-item" id="menu-edit" @click=${components.menuEdit.onClick(pages, state)}>✏️ Edit</li>`
}

components.menuEdit.onClick = (pages, state) => () => {
  render(pages.edit(pages, state), document.body)
}

components.menuRegister = (pages, state) => {
  return html`<li class="menu-item" id="menu-register" @click=${components.menuRegister.onClick(pages, state)}>👤 Register</li>`
}

components.menuRegister.onClick = (pages, state) => () => {
  render(pages.register(pages, state), document.body)
}

components.menuLogout = (pages, state) => {
  return html`<li class="menu-item" id="menu-logout" @click=${components.menuLogout.onClick(pages, state)}>❌ Logout</li>`
}

components.menuLogout.onClick = (pages, state) => () => {
  logout()
  render(pages.signin(pages, state), document.body)
}

components.menuPrivacy = (pages, state) => {
  return html`<li class="menu-item" id="menu-privacy" @click=${components.menu.onClick(pages, state)}>🔒 Privacy</li>`
}

components.menuPrivacy.onClick = (pages, state) => () => {
  render(pages.privacy(pages, state), document.body)
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

/**
 * Toggle the page-theme.
 *
 * TODO refactor this code heavily
 *
 * @param {*} state
 */
const toggleTheme = state => () => {
  const storedScheme = local.get('theme')
  const theme = storedScheme || 'light'
  const newTheme = theme === 'light'
    ? 'dark'
    : 'light'

  const $html = document.querySelector('html')
  $html.setAttribute('data-theme', newTheme)
  local.set('theme', newTheme)

  // -- todo factor this out into a component
  moodGraphs.refreshMoodGraphs(state)

  const $darkModeToggle = document.querySelector('#dark-mode-toggle')
  const $menuDarkModeToggle = document.querySelector('#dark-mode-toggle')

  $darkModeToggle.textContent = newTheme === 'dark'
    ? '🌙'
    : '☀️'

  $menuDarkModeToggle.textContent = newTheme === 'dark'
    ? '☀️ Light Mode'
    : '🌙 Dark Mode'
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
