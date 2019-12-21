
const logout = () => {
  document.cookie = ''
  localStorage.clear()
}

export default logout
